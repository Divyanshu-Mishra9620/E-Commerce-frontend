"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { User, Mail, KeyRound, Loader2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

const FormInput = ({
  icon: Icon,
  type,
  name,
  value,
  onChange,
  placeholder,
  required,
}) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default function RegisterPage() {
  const router = useRouter();
  const { status } = useSession();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.email || !formData.password || !formData.name) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed.");

      toast.success("Account created successfully! Please Sign in.");
      router.push("/api/auth/signin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
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
              Join Our Community
            </h2>
            <p className="text-gray-200 mt-2">
              Create an account to get started.
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create an Account
            </h1>
            <p className="text-gray-600 mb-8">Let's get you started!</p>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FcGoogle size={22} />
              <span className="font-medium text-gray-700">
                Sign up with Google
              </span>
            </button>

            <div className="flex items-center my-6">
              <hr className="w-full border-gray-200" />
              <span className="px-4 text-gray-400 text-sm">OR</span>
              <hr className="w-full border-gray-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <FormInput
                icon={User}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
              <FormInput
                icon={Mail}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Elysoria@gmail.com"
                required
              />
              <FormInput
                icon={KeyRound}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
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
                disabled={loading}
                className="w-full flex justify-center py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="text-center mt-6 text-sm text-gray-600">
              <span>Already have an account? </span>
              <Link
                href="/api/auth/signin"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign in here
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
