import { getSession, signOut } from "next-auth/react";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export const authedFetch = async (url, options = {}) => {
  const session = await getSession();
  const token = session?.user?.accessToken;

  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body && typeof options.body === "object") {
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${BACKEND_URI}${url}`, { ...options, headers });

  if (response.status === 401) {
    await signOut({ callbackUrl: "/api/auth/signin" });
    throw new Error("Session expired. Please log in again.");
  }

  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "An error occurred.");
  }

  return data;
};
