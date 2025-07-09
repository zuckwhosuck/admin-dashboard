"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type User = { username: string } | null;

type AuthContextType = {
  user: User;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const stored = localStorage.getItem("admin-user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async (username: string, password: string) => {
    if (username === "admin" && password === "admin123") {
      const user = { username };
      setUser(user);
      localStorage.setItem("admin-user", JSON.stringify(user));
      document.cookie = `admin-user=${encodeURIComponent(JSON.stringify(user))}; path=/`;
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("admin-user");
    document.cookie = "admin-user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}; 