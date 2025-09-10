import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

async function refreshAccessToken(token) {
  try {
    const res = await fetch(`${BACKEND_URI}/api/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const refreshed = await res.json();
    if (!res.ok) throw refreshed;

    return {
      ...token,
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + refreshed.expiresIn * 1000,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const res = await fetch(`${BACKEND_URI}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });
          const data = await res.json();
          if (!res.ok || !data.user) throw new Error(data.message);

          return {
            id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            expiresIn: data.expiresIn,
          };
        } catch (error) {
          throw new Error(error.message || "Invalid credentials.");
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          const res = await fetch(`${BACKEND_URI}/api/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              image: user.image,
            }),
          });
          if (!res.ok) return false;

          const data = await res.json();
          user.id = data.user._id;
          user.role = data.user.role;
          user.accessToken = data.accessToken;
          user.refreshToken = data.refreshToken;
          user.expiresIn = data.expiresIn;
        } catch (error) {
          console.error("Google Sign-In error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        return {
          id: user.id,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + (user.expiresIn ?? 15 * 60) * 1000,
        };
      }
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user._id = token.id;
      session.user.role = token.role;
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.error = token.error;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
