"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the auth page with the login form displayed by default
    router.replace("/auth?login=true");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted-beige">
      <p className="text-warm-brown">Redirecting to login...</p>
    </div>
  );
}
