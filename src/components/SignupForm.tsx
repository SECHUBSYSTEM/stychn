"use client";

import { useState } from "react";

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onAuth?: (username: string) => void;
}

export default function SignupForm({
  onSwitchToLogin,
  onAuth,
}: SignupFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    subscribeToUpdates: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    if (onAuth) onAuth(formData.username);
    console.log("Signup attempt:", formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl space-y-8 p-8 w-full max-w-lg font-plus-jakarta-sans">
      <h1 className="text-3xl font-bold text-black font-plus-jakarta-sans">
        Sign Up
      </h1>

      <div className="mb-8">
        <span className="text-gray-600 font-semibold font-plus-jakarta-sans">
          Already have an account?{" "}
        </span>
        <button
          onClick={onSwitchToLogin}
          className="text-warm-brown text-sm font-semibold font-plus-jakarta-sans">
          Sign In
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-warm-brown focus:border-transparent transition-colors font-plus-jakarta-sans"
            required
          />
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-warm-brown focus:border-transparent transition-colors font-plus-jakarta-sans"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-warm-brown focus:border-transparent transition-colors font-plus-jakarta-sans"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-warm-brown focus:border-transparent transition-colors font-plus-jakarta-sans"
              required
            />
          </div>
        </div>

        <div className="flex items-center">
          <label className="flex items-center cursor-pointer select-none">
            <span className="relative cursor-pointer inline-block w-5 h-5 mr-2 align-middle">
              <input
                type="checkbox"
                name="subscribeToUpdates"
                checked={formData.subscribeToUpdates}
                onChange={handleInputChange}
                className="peer appearance-none w-5 h-5 border-2 border-warm-brown rounded-md bg-white checked:bg-warm-brown checked:border-warm-brown focus:outline-none focus:ring-2 focus:ring-warm-brown transition-colors"
              />
              <svg
                className="absolute left-0 top-0 w-5 h-5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <polyline points="5 11 9 15 15 7" />
              </svg>
            </span>
            <span className="text-gray-700 text-sm font-plus-jakarta-sans">
              Subscribe to product updates and news
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full max-w-[8rem] bg-warm-brown text-white py-2 rounded-full font-medium hover:bg-opacity-90 transition-colors shadow-md font-plus-jakarta-sans">
          Sign Up
        </button>
      </form>
    </div>
  );
}
