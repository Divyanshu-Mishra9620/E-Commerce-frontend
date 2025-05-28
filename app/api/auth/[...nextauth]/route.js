import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

/**
 * Check rate limiting
 * @param {string} email
 * @returns {boolean}
 */
const isRateLimited = (email) => {
  const attempts = loginAttempts.get(email) || {
    count: 0,
    timestamp: Date.now(),
  };
  const timeWindow = 15 * 60 * 1000; // 15 minutes

  if (Date.now() - attempts.timestamp > timeWindow) {
    loginAttempts.set(email, { count: 1, timestamp: Date.now() });
    return false;
  }

  if (attempts.count >= 5) return true;

  attempts.count++;
  loginAttempts.set(email, attempts);
  return false;
};

const loginAttempts = new Map();

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        if (isRateLimited(credentials.email)) {
          throw new Error("Too many login attempts. Please try again later.");
        }

        try {
          const res = await fetch(`${BACKEND_URI}/api/auth/check-user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "User-Agent": "NextAuth.js",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            timeout: 10000, // 10 second timeout
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Authentication failed");
          }

          const data = await res.json();

          if (!data.user?._id) {
            throw new Error("Invalid user data received");
          }

          loginAttempts.delete(credentials.email);

          return {
            id: data.user._id,
            name: data.user.name || "User",
            email: data.user.email,
            role: data.user.role || "user",
            image: data.user.profilePic,
            emailVerified: data.user.emailVerified || false,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        return profile.email_verified;
      }
      return true;
    },

    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.emailVerified = user.emailVerified;
        if (account?.provider) {
          token.provider = account.provider;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.provider = token.provider;
        session.user.emailVerified = token.emailVerified;
      }
      return session;
    },
  },

  events: {
    async signIn({ user, account }) {},
    async signOut({ token }) {},
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },

  debug: process.env.NODE_ENV === "development",

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
