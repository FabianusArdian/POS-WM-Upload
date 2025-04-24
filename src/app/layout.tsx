import { TempoInit } from "@/components/tempo-init";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { RoleProvider } from "@/contexts/roleContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "POS Warung Makan",
  description: "POS Jualan Warung Makan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={inter.className}>
          <RoleProvider>
              {children}
              <TempoInit />
          </RoleProvider>
      </body>
    </html>
  );
}
