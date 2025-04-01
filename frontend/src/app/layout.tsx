"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/Sidebar";
import { Toast, ToastProvider } from "@/components/ui/toast";
import { metadata } from "../types/metadata";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider } from "@/contexts/auth/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const isTokenExpired = () => {
      const now = new Date().getTime();
      const tokenTimestamp = localStorage.getItem("tokenTimestamp");
      const expiresIn = 1800 * 1000; // 30 minutos

      if (!tokenTimestamp) {
        return true;
      }

      return now - Number(tokenTimestamp) > expiresIn;
    };

    if (typeof window !== "undefined") {
      if (!token || isTokenExpired()) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenTimestamp");
        router.push("/login");
      }
    }
  }, [router]);

  return (
    <html lang="en" className="h-full w-full">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body
        className={cn(
          "h-full w-full bg-background font-sans antialiased",
          inter.className
        )}
      >
        <AuthProvider>
          <ToastProvider>
            {children}
            <Toast />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
