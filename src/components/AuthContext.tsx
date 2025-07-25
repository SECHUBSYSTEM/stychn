"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  isFirstLogin: boolean;
  setIsFirstLogin: (v: boolean) => void;
  user?: { name: string; avatarUrl?: string } | null;
  setUser: (u: { name: string; avatarUrl?: string } | null) => void;
  logout: () => void;
}

interface AuthData {
  isLoggedIn: boolean;
  isFirstLogin: boolean;
  user: { name: string; avatarUrl?: string } | null;
  loginTime: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "stychn_auth";
const SESSION_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [user, setUser] = useState<{ name: string; avatarUrl?: string } | null>(
    null
  );

  // Define logout function first
  const logout = () => {
    setIsLoggedIn(false);
    setIsFirstLogin(false);
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const enhancedSetIsLoggedIn = (value: boolean) => {
    setIsLoggedIn(value);
    if (!value) {
      // If setting to false, also clear other auth data
      setIsFirstLogin(false);
      setUser(null);
    }
  };

  // Load auth state from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedAuth) {
      try {
        const authData: AuthData = JSON.parse(savedAuth);
        const now = Date.now();

        // Check if session has expired (1 hour)
        if (now - authData.loginTime < SESSION_DURATION) {
          setIsLoggedIn(authData.isLoggedIn);
          setIsFirstLogin(authData.isFirstLogin);
          setUser(authData.user);
        } else {
          // Session expired, clear auth
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } catch (error) {
        // Invalid auth data, clear it
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isLoggedIn) {
      const authData: AuthData = {
        isLoggedIn,
        isFirstLogin,
        user,
        loginTime: Date.now(),
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [isLoggedIn, isFirstLogin, user]);

  // Auto-logout after 1 hour
  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
        logout();
      }, SESSION_DURATION);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn: enhancedSetIsLoggedIn,
        isFirstLogin,
        setIsFirstLogin,
        user,
        setUser,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
