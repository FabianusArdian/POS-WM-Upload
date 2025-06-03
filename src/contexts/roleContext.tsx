"use client";

import { createContext, useEffect, useState, useContext } from "react";
import { jwtVerify } from "jose";
import { getTokenFromCookies } from "@/lib/utils";

const RoleContext = createContext<string | null>(null);

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<string | null>(null);

  const secretKey = process.env.NEXT_PUBLIC_JWT_SECRETT;
  if (!secretKey) throw new Error("Missing NEXT_PUBLIC_JWT_SECRET");
  const encodedSecret = new TextEncoder().encode(secretKey);
  
   useEffect(() => {
    async function fetchRole() {
      const token = getTokenFromCookies();
      if (!token) return;
      const {payload} = await jwtVerify(token, encodedSecret, {
        algorithms: ["HS256"],
      })
      setRole(payload.role as string);
      console.log("Role:", payload.role);
    }

    fetchRole();
  }, []);

  return <RoleContext.Provider value={role}>{children}</RoleContext.Provider>;
};

export const useRole = () => useContext(RoleContext);
