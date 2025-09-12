import { getSession, signOut } from "next-auth/react";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export const authedFetch = async (url, options = {}) => {
  let session = await getSession();

  let token = session?.user?.accessToken;

  const refreshToken = async () => {
    try {
      const res = await fetch(`${BACKEND_URI}/api/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: session?.user?.refreshToken }),
      });
      if (!res.ok) throw new Error("Failed to refresh session.");

      const data = await res.json();

      await getSession({ force: true });
      return (await getSession())?.user?.accessToken;
    } catch (error) {
      await signOut({ callbackUrl: "/api/auth/signin" });
      throw new Error("Session expired. Please log in again.");
    }
  };

  const fetchOptions = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : null,
  };

  let response = await fetch(`${BACKEND_URI}${url}`, fetchOptions);

  if (response.status === 401) {
    const newToken = await refreshToken();
    fetchOptions.headers.Authorization = `Bearer ${newToken}`;

    response = await fetch(`${BACKEND_URI}${url}`, fetchOptions);
  }

  return response;
};
