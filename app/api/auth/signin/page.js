"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { motion } from "framer-motion";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const callbackError = searchParams.get("error");
    if (callbackError) {
      setError("Authentication failed. Please check your credentials.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (status === "authenticated") {
      router.push(searchParams.get("callbackUrl") || "/");
    }
  }, [status, router, searchParams]);

  const handleSignIn = async (provider, credentials = {}) => {
    setLoading(true);
    setError("");

    const result = await signIn(provider, {
      redirect: false,
      ...credentials,
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.ok) {
      router.push(searchParams.get("callbackUrl") || "/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          Sign In
        </h1>

        <motion.button
          onClick={() => handleSignIn("google")}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors"
        >
          <FcGoogle size={22} /> Sign in with Google
        </motion.button>

        <div className="flex items-center my-6">
          <hr className="w-full border-gray-600" />
          <span className="px-4 text-gray-400">OR</span>
          <hr className="w-full border-gray-600" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn("credentials", { email, password });
          }}
          className="space-y-5"
        >
          <div className="relative">
            <AiOutlineMail className="absolute left-3 top-3.5 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="your@email.com"
            />
          </div>
          <div className="relative">
            <AiOutlineLock className="absolute left-3 top-3.5 text-gray-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Password"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/50 text-red-400 text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Sign In with Email"
            )}
          </motion.button>
        </form>
        <div className="text-center mt-6 text-sm text-gray-400">
          <span>Don't have an account? </span>
          <Link href="/auth/register" className="text-blue-400 hover:underline">
            Register here
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
