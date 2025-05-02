import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

function navside() {
  const router = useRouter();

  return (
    <div className="w-64 border-r bg-card p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary">Food POS</h2>
        <p className="text-sm text-muted-foreground">Restaurant Management</p>
      </div>

      <Button variant="ghost" className="w-full justify-start mb-4" size="lg" onClick={() => router.push("/dashboard")}>
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back to Dashboard
      </Button>
    </div>
  );
}

export default navside;
