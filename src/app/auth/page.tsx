"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import NavigationSidebar from "@/components/NavigationSidebar";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import CongratulationsModal from "@/components/CongratulationsModal";
import { useAuth } from "@/components/AuthContext";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const showLogin = searchParams.get("login") === "true";
  const showSignup = searchParams.get("signup") === "true";
  const { isLoggedIn, setIsLoggedIn, isFirstLogin, setIsFirstLogin, setUser } =
    useAuth();
  const [showCongrats, setShowCongrats] = useState(false);
  const router = useRouter();

  function handleAuth(username: string) {
    setIsLoggedIn(true);
    setIsFirstLogin(true);
    setUser({ name: username, avatarUrl: "/avatar.svg" });
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
    <div className="min-h-screen bg-muted-beige">
      <NavigationSidebar
        activePage={showLogin ? "login" : showSignup ? "signup" : "login"}
      />
      <div className="md:ml-80 min-h-screen flex items-center justify-center overflow-y-auto px-4 py-8">
        {showLogin ? (
          <LoginForm
            onSwitchToSignup={() => router.push("/auth?signup=true")}
            onAuth={handleAuth}
          />
        ) : (
          <SignupForm
            onSwitchToLogin={() => router.push("/auth?login=true")}
            onAuth={handleAuth}
          />
        )}
      </div>
    </div>
  );
}
