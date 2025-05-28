"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

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
      }
    };
    fetchUser();
  }, [session]);

  if (status === "loading") return <p>Loading...</p>;

  const getLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLoading(false);
        setMessage("Location detected successfully! Now you can save.");
      },
      (error) => {
        setLoading(false);
        alert("Unable to retieve location: " + error.message);
      }
    );
  };

  const saveAddress = async () => {
    setSaving(true);
    const res = await fetch(`/api/users/${session.user.email}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ latitude, longitude, fullAddress }),
    });

    const data = await res.json();
    setSaving(false);

    if (res.ok) setMessage("Address saved successfully!");
    else setMessage(data.message);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="name"
              disabled
              placeholder="Name"
              value={user?.name || ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              disabled
              placeholder="Email"
              value={session.user.email || ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
        </div>
      </form>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">Set Your Address</h2>
        <button
          onClick={getLiveLocation}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          {loading ? "Detecting..." : "Use Live Location"}
        </button>
        <div className="mt-4">
          <label className="block mb-1">Enter Address Manually:</label>
          <input
            type="text"
            className="border rounded-md p-2 w-full"
            placeholder=""
            value={fullAddress}
            onChange={(e) => setFullAddress(e.target.value)}
          />
        </div>
        {latitude && longitude && (
          <p className="mt-2 text-sm">
            📍 Detected Location: {latitude}, {longitude}
          </p>
        )}
        <button
          onClick={saveAddress}
          className="bg-green-500 text-white px-4 py-2 mt-4 rounded-md"
        >
          {saving ? "Saving..." : "Save Address"}
        </button>
        {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
      </div>
    </>
  );
};

export default ProfileForm;
