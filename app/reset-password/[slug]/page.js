"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  KeyRound,
  ShieldCheck,
  Loader2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const FormInput = ({ icon: Icon, type, value, onChange, placeholder }) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
    <input
      type={type}
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
      <Icon className="h-5 w-5" />
      <span>{message}</span>
    </div>
  );
};

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.slug;
  console.log(token);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(
        `${BACKEND_URI}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => router.push("/api/auth/signin"), 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl backdrop-blur-sm ring-1 ring-white/10">
        <div className="text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-blue-500" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            Set a New Password
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Your new password must be strong and secure.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <FormInput
              icon={KeyRound}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <FormInput
              icon={KeyRound}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

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
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
