"use client";
import { useAuth } from "@/components/AuthContext";
import Image from "next/image";

export default function PageHeader() {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <div className="flex items-center justify-between px-4 md:px-12 py-4 md:py-6 bg-white border-b border-warm-brown/55 min-h-[70px] md:min-h-[80px]">
      {/* This div is for spacing, but we can add a title or breadcrumbs here later */}
      <div />

      {isLoggedIn ? (
        <div className="flex items-center gap-2 md:gap-4">
          <Image
            src={user?.avatarUrl || "/avatar.svg"}
            alt={user?.name || "User"}
            width={32}
            height={32}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-300"
          />
          <span className="font-semibold text-gray-800 text-sm md:text-base hidden sm:block">
            {user?.name || "Welcome!"}
          </span>
          <Image
            src="/bell.png"
            alt="Notifications"
            width={24}
            height={24}
            className="w-6 h-6 md:w-8 md:h-8 object-contain cursor-pointer rounded-full hover:bg-gray-100 p-1"
          />
          <Image
            src="/settings-tiler.png"
            alt="Settings"
            width={24}
            height={24}
            className="w-6 h-6 md:w-8 md:h-8 object-contain cursor-pointer rounded-full hover:bg-gray-100 p-1"
          />
          <button
            onClick={logout}
            className="ml-1 md:ml-2 text-warm-brown hover:text-opacity-80 transition-colors text-xs md:text-sm">
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-2 md:gap-4">
          <a
            href="/auth?login=true"
            className="border border-warm-brown text-warm-brown rounded-full px-4 md:px-6 py-1.5 md:py-2 font-medium hover:bg-warm-brown hover:text-white transition-colors text-sm md:text-base">
            Sign In
          </a>
          <a
            href="/auth?signup=true"
            className="bg-warm-brown text-white rounded-full px-4 md:px-6 py-1.5 md:py-2 font-medium hover:bg-opacity-90 transition-colors text-sm md:text-base">
            Sign Up
          </a>
        </div>
      )}
    </div>
  );
}
