"use client";
import { MapPin } from "lucide-react";

const FormInput = ({ id, label, value, onChange }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      type="text"
      name={id}
      id={id}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export function AddressForm({ address, setAddress }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
        <MapPin className="text-gray-500" /> Shipping Address
      </h2>
      <div className="space-y-4">
        <FormInput
          id="street"
          label="Street"
          value={address.street}
          onChange={handleChange}
        />
        <FormInput
          id="city"
          label="City"
          value={address.city}
          onChange={handleChange}
        />
        <FormInput
          id="state"
          label="State"
          value={address.state}
          onChange={handleChange}
        />
        <FormInput
          id="postalCode"
          label="Postal Code"
          value={address.postalCode}
          onChange={handleChange}
        />
        <FormInput
          id="country"
          label="Country"
          value={address.country}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
