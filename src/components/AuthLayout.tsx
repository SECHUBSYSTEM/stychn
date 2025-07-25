"use client";

import { useState } from "react";
import NavigationSidebar from "./NavigationSidebar";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

export default function AuthLayout() {
  const [currentForm, setCurrentForm] = useState<"login" | "signup">("login");
  const {
    isLoggedIn,
    setIsLoggedIn,
    isFirstLogin,
    setIsFirstLogin,
    user,
    setUser,
  } = useAuth();
  const [showCongrats, setShowCongrats] = useState(false);
  const router = useRouter();

  // Simulate login/signup
  function handleAuth(_type: "login" | "signup") {
    setIsLoggedIn(true);
    setIsFirstLogin(true);
    setUser({ name: "Vanessa Laird", avatarUrl: "/avatar.png" });
    setShowCongrats(true);
  }

  function handleContinue() {
    setIsFirstLogin(false);
    setShowCongrats(false);
    router.push("/how-to/easy-steps");
  }

  if (isLoggedIn && isFirstLogin && showCongrats) {
    const CongratulationsModal = require("./CongratulationsModal").default;
    return <CongratulationsModal isOpen={true} onClose={handleContinue} />;
  }

  return (
    <div className="flex h-screen">
      <NavigationSidebar activePage={currentForm} />

      {isLoggedIn ? (
        <div className="flex-1 flex items-center justify-center text-2xl font-bold">
          Welcome, {user?.name}!
        </div>
      ) : currentForm === "login" ? (
        <LoginForm
          onSwitchToSignup={() => setCurrentForm("signup")}
          onAuth={() => handleAuth("login")}
        />
      ) : (
        <SignupForm
          onSwitchToLogin={() => setCurrentForm("login")}
          onAuth={() => handleAuth("signup")}
        />
      )}
    </div>
  );
}
