"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { Mail, KeyRound, Loader2 } from "lucide-react";
import Image from "next/image";

const FormInput = ({
  icon: Icon,
  type,
  value,
  onChange,
  placeholder,
  required,
}) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingProvider, setLoadingProvider] = useState(null);
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
    setLoadingProvider(provider);
    setError("");

    const result = await signIn(provider, { redirect: false, ...credentials });

    if (result?.error) {
      setError(result.error);
    } else if (result?.ok) {
      router.push(searchParams.get("callbackUrl") || "/");
    }
    setLoadingProvider(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="grid md:grid-cols-2 max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="hidden md:block relative">
          <Image
            src="/images/Elysoria-logo.png"
            alt="Promotional banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent p-8 flex flex-col justify-end">
            <h2 className="text-3xl font-bold text-white">
              Discover Exclusive Deals
            </h2>
            <p className="text-gray-200 mt-2">
              Sign in to unlock a personalized shopping experience.
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-600 mb-8">
              Sign in to continue to Elysoria.
            </p>

            <button
              onClick={() => handleSignIn("google")}
              disabled={!!loadingProvider}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FcGoogle size={22} />
              <span className="font-medium text-gray-700">
                Sign in with Google
              </span>
            </button>

            <div className="flex items-center my-6">
              <hr className="w-full border-gray-200" />
              <span className="px-4 text-gray-400 text-sm">OR</span>
              <hr className="w-full border-gray-200" />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSignIn("credentials", { email, password });
              }}
              className="space-y-5"
            >
              <FormInput
                icon={Mail}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
              <FormInput
                icon={KeyRound}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />

              {error && (
                <div className="p-3 bg-red-100 text-red-700 text-sm rounded-lg text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!!loadingProvider}
                className="w-full flex justify-center py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingProvider === "credentials" ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="text-center mt-6 text-sm text-gray-600">
              <span>Don't have an account? </span>
              <Link
                href="/api/auth/register"
                className="text-blue-600 hover:underline font-medium"
              >
                Register here
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
