import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import React from "react";

function navside() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <button
        className="lg:hidden md:hidden sm:block"
        onClick={handleToggleSidebar}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <div
        className={`sidebar ${isSidebarOpen ? 'block' : 'hidden'} lg:block`}
      >
        <div className="w-64 border-r bg-card p-4 flex flex-col sm:w-24 md:w-32 lg:w-48">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary sm:text-sm md:text-md lg:text-lg">Food POS</h2>
            <p className="text-sm text-muted-foreground sm:text-sm md:text-md lg:text-lg">Restaurant Management</p>
          </div>

          <Button variant="ghost" className="w-full justify-start mb-4 sm:p-0 md:p-0 lg:p-4" size="lg" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

export default navside;
