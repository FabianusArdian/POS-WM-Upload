"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InventoryManager from "@/components/pos/InventoryManager";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Navside from "@/components/navside/navside";
export default function InventoryPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen bg-background">
      <Navside />

      <main className="flex-1">
        <Card className="border-none shadow-none">
          <CardContent className="px-0 pb-0">
            <InventoryManager />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
