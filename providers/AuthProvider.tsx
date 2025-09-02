"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role?: string | null;
} | null;

type AuthContextValue = {
  user: AuthUser;
  isAuthenticated: boolean;
  token: string | null;
  login: (payload: { email: string; password: string }) => Promise<boolean>;
  register: (payload: { name: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = localStorage.getItem("token");
    if (t) {
      setToken(t);
      try {
        const payload = JSON.parse(atob(t.split(".")[1] || ""));
        setUser({ id: payload.userId, email: payload.email, name: payload.name ?? null, role: payload.role ?? null, image: null });
      } catch (e) {
        // invalid token format
      }
    }
  }, []);

  const isAuthenticated = Boolean(token && user);

  const login: AuthContextValue["login"] = async ({ email, password }) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      const t = data?.token as string | undefined;
      if (!t) return false;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", t);
        // Set a readable cookie so server components (e.g., admin guard) can read the token
        document.cookie = `token=${t}; path=/; SameSite=Lax`;
      }
      setToken(t);
      try {
        const payload = JSON.parse(atob(t.split(".")[1] || ""));
        setUser({ id: payload.userId, email: payload.email, name: payload.name ?? null, role: payload.role ?? null, image: null });
      } catch {}
      return true;
    } catch {
      return false;
    }
  };

  const register: AuthContextValue["register"] = async ({ name, email, password }) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) return false;
      // Registration succeeded; skip auto-login unless backend returns a token
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    if (typeof document !== "undefined") {
      document.cookie = `token=; path=/; Max-Age=0`;
    }
  };

  const value = useMemo<AuthContextValue>(() => ({ user, isAuthenticated, token, login, register, logout }), [user, isAuthenticated, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


