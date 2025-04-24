"use client";

import { createContext, useEffect, useState, useContext } from "react";

const RoleContext = createContext<string | null>(null);

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role="));
    if (cookie) {
      setRole(cookie.split("=")[1]);
    }
  }, []);

  return <RoleContext.Provider value={role}>{children}</RoleContext.Provider>;
};

export const useRole = () => useContext(RoleContext);
