"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/contexts/roleContext";

export function useCheckRole(allowedRoles: string[]) {
  const router = useRouter();
  const role = useRole();

  useEffect(() => {
    if (role && !allowedRoles.includes(role)) {
      router.replace("/unauthorized");
    }
  }, [role, router, allowedRoles]);

  return role;
}