"use client";
import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import CongratulationsModal from "@/components/CongratulationsModal";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { isLoggedIn, setIsLoggedIn, isFirstLogin, setIsFirstLogin, setUser } =
    useAuth();
  const [showCongrats, setShowCongrats] = useState(false);
  const router = useRouter();

  function handleLogin() {
    setIsLoggedIn(true);
    setIsFirstLogin(true);
    setUser({ name: "Vanessa Laird", avatarUrl: "/avatar.svg" });
    setShowCongrats(true);
  }

  function handleContinue() {
    setIsFirstLogin(false);
    setShowCongrats(false);
    router.push("/how-to/easy-steps");
  }

  if (isLoggedIn && isFirstLogin && showCongrats) {
    return <CongratulationsModal isOpen={true} onClose={handleContinue} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted-beige">
      <LoginForm
        onSwitchToSignup={() => router.push("/signup")}
        onAuth={handleLogin}
      />
    </div>
  );
}
