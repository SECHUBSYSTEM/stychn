"use client";

import { useState } from "react";

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onAuth?: (username: string) => void;
}

export default function LoginForm({
  onSwitchToSignup,
  onAuth,
}: LoginFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    if (onAuth) onAuth(formData.username);
    console.log("Login attempt:", formData);
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
        Sign In
      </h1>

      <div className="mb-8">
        <span className="text-gray-600 font-semibold font-plus-jakarta-sans">
          Don't have an account?{" "}
        </span>
        <button
          onClick={onSwitchToSignup}
          className="text-warm-brown text-sm font-semibold font-plus-jakarta-sans">
          Sign Up
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
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-warm-brown focus:border-transparent transition-colors font-plus-jakarta-sans"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer select-none">
            <span className="relative inline-block w-5 h-5 mr-2 align-middle">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
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
            <span className="text-gray-700 font-plus-jakarta-sans">
              Remember me
            </span>
          </label>

          <button
            type="button"
            className="text-warm-brown text-sm font-semibold hover:underline font-plus-jakarta-sans">
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full max-w-[8rem] bg-warm-brown text-white py-2 rounded-full font-medium hover:bg-opacity-90 transition-colors shadow-md font-plus-jakarta-sans">
          Sign In
        </button>
      </form>
    </div>
  );
}
