"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineMail } from "react-icons/ai";
import Link from "next/link";
import "@/app/_styles/global.css";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session, status } = useSession();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await signIn("google", { redirect: false });
      console.log("Google Sign-In Result:", result);

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
    } catch (err) {
      setError("Failed to sign in with Google");
      console.error("Google Sign-In error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const { name, email, image: profilePic } = session.user;

      const saveUserToDatabase = async () => {
        try {
          const response = await fetch(`${BACKEND_URI}/api/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              profilePic,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            setError(data.message || "Failed to save user to database");
            return;
          }

          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
            console.log("Signed in with Google successfully ✅");
          }

          router.push("/");
        } catch (err) {
          setError("Failed to save user to database");
          console.error("Error saving user to database:", err);
        } finally {
          setLoading(false);
        }
      };

      saveUserToDatabase();
    }
  }, [session, status, router]);

  const handleCredentialsSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = { email, password };
    console.log("Sending Payload:", payload);

    try {
      const res = await fetch(`${BACKEND_URI}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("API Response:", data);

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        console.log("Signed in successfully ✅");
      }
      await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/",
      });
      router.push("/");
    } catch (err) {
      setError("Server error, please try again later.");
      console.error("Sign-in error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Sign In
        </h1>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 mt-4 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 transition"
        >
          <FcGoogle className="text-xl" /> Sign in with Google
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <AiOutlineMail className="text-lg" />
            {loading ? "Signing in..." : "Sign in with Email"}
          </button>
        </form>

        <div className="text-center text-gray-600 mt-4">
          <Link
            href="/api/forgot-password"
            className="text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <p className="text-center text-gray-600 mt-4">
          Don&apos;t have an account?{" "}
          <Link
            href="/api/auth/register"
            className="text-blue-600 hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
