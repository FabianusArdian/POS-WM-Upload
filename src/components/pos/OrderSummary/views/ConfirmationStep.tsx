"use client";

import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { useEffect } from "react";

export function ConfirmationStep({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timeout = setTimeout(onDone, 2000);
    return () => clearTimeout(timeout);
  }, [onDone]);

  return (
    <CardContent className="flex-grow flex flex-col items-center justify-center">
      <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1 text-base">
        Payment Successful
      </Badge>
      <p className="text-center mb-4">
        Your order has been processed and sent to the kitchen.
      </p>
      <p className="text-center text-muted-foreground">
        Generating receipt...
      </p>
    </CardContent>
  );
}
