"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export default function ResetPassword() {
  const params = useParams();
  const token = params.slug;
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(
        `${BACKEND_URI}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => router.push("/api/auth/signin"), 3000);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 bg-gray-900 border border-gray-800 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold text-center text-gray-100">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your new password"
              className="
                mt-1 w-full px-3 py-2 bg-gray-800 text-gray-100 placeholder-gray-500 
                rounded-md border border-gray-700 
                focus:outline-none focus:ring-2 focus:ring-gray-600
              "
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {message && <p className="text-green-400 text-sm">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full flex items-center justify-center gap-2 py-2 px-4
              bg-gray-700 text-gray-100 rounded-md 
              hover:bg-gray-600 transition-colors 
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
