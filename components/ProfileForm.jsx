"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MapPin, AlertCircle, CheckCircle, Loader } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const ProfileForm = () => {
  const { data: session, status } = useSession();

  const [errors, setErrors] = useState({});
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [fullAddress, setFullAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!session?.user?.email) return;
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URI}/api/users/email/${session.user.email}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await res.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load user data");
      }
    };
    fetchUser();
  }, [session]);

  if (status === "loading")
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );

  const getLiveLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setMessage("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLoading(false);
        setMessage("Location detected successfully! Now you can save.");
        setMessageType("success");
        toast.success("Location detected!");
      },
      (error) => {
        setLoading(false);
        setMessage(`Unable to retrieve location: ${error.message}`);
        setMessageType("error");
        toast.error(`Location error: ${error.message}`);
      }
    );
  };

  const saveAddress = async () => {
    if (!latitude || !longitude) {
      toast.error("Please detect your location first");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`/api/users/${session.user.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude, fullAddress }),
      });

      const data = await res.json();
      setSaving(false);

      if (res.ok) {
        setMessage("Address saved successfully!");
        setMessageType("success");
        toast.success("Address saved successfully!");
      } else {
        setMessage(data.message || "Failed to save address");
        setMessageType("error");
        toast.error(data.message || "Failed to save address");
      }
    } catch (error) {
      setSaving(false);
      setMessage(error.message || "An error occurred");
      setMessageType("error");
      toast.error(error.message || "An error occurred");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg p-6 border border-slate-300 shadow-sm"
      >
        <h3 className="text-xl font-bold text-slate-900 mb-4">
          Personal Information
        </h3>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                disabled
                placeholder="Name"
                value={user?.name || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                disabled
                placeholder="Email"
                value={session.user.email || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.email}
                </p>
              )}
            </div>
          </div>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg p-6 border border-slate-300 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-slate-100 rounded-lg">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Set Your Address</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Location Detection
            </h4>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={getLiveLocation}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg font-semibold transition-all duration-200 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Detecting Location...
                </>
              ) : (
                <>
                  <MapPin className="w-5 h-5" />
                  Use Live Location
                </>
              )}
            </motion.button>

            {latitude && longitude && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-slate-50 border border-slate-300 rounded-lg flex items-start gap-2"
              >
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    📍 Location Detected
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Latitude: {latitude.toFixed(6)}, Longitude:{" "}
                    {longitude.toFixed(6)}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Address Details
            </h4>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Address
              </label>
              <textarea
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your full address here..."
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={saveAddress}
            disabled={saving || !latitude || !longitude}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white rounded-lg font-semibold transition-all duration-200 shadow-sm"
          >
            {saving ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Save Address
              </>
            )}
          </motion.button>

          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-3 rounded-lg flex items-start gap-2 ${
                messageType === "success"
                  ? "bg-slate-50 border border-green-300"
                  : "bg-slate-50 border border-red-300"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <p className="text-sm font-medium text-slate-900">{message}</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileForm;
