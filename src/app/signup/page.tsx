"use client";
import { useState } from "react";
import SignupForm from "@/components/SignupForm";
import CongratulationsModal from "@/components/CongratulationsModal";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const { isLoggedIn, setIsLoggedIn, isFirstLogin, setIsFirstLogin, setUser } =
    useAuth();
  const [showCongrats, setShowCongrats] = useState(false);
  const router = useRouter();

  function handleSignup() {
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
      <SignupForm
        onSwitchToLogin={() => router.push("/login")}
        onAuth={handleSignup}
      />
    </div>
  );
}
