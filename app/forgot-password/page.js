"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  MailQuestion,
  Loader2,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const FormInput = ({ icon: Icon, value, onChange, placeholder }) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
    <input
      type="email"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const AlertMessage = ({ message, isError }) => {
  if (!message) return null;

  const iconColor = isError ? "text-red-400" : "text-green-400";
  const bgColor = isError ? "bg-red-500/10" : "bg-green-500/10";
  const Icon = isError ? AlertTriangle : CheckCircle;

  return (
    <div
      className={`flex items-center gap-3 rounded-md p-3 text-sm ${bgColor} ${iconColor}`}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${BACKEND_URI}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessage(
        "If an account with that email exists, we have sent a password reset link."
      );
    } catch (err) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl backdrop-blur-sm ring-1 ring-white/10">
        <div className="text-center">
          <MailQuestion className="mx-auto h-12 w-12 text-blue-500" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            Forgot Password
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email and we'll send you a link to get back into your
            account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <FormInput
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
          />

          <AlertMessage message={error} isError={true} />
          <AlertMessage message={message} isError={false} />

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/api/auth/signin"
            className="group inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-gray-600" />
            <span className="group-hover:underline text-gray-600">
              Back to Sign In
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
