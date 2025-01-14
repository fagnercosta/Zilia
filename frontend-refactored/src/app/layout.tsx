"use client"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"
import Sidebar from "@/components/Sidebar";
import { Toast, ToastProvider } from "@/components/ui/toast";
import { metadata } from "../types/metadata"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (typeof window !== 'undefined') {
      if (!token) { router.push('/pages/login'); }
    }

    const isTokenExpired = () => {
      const now = new Date().getTime(); 
      const tokenTimestamp = localStorage.getItem('tokenTimestamp');
      const expiresIn = 1800 * 1000; 

      if (!tokenTimestamp) {
        return true;
      }

      return now - Number(tokenTimestamp) > expiresIn;
    };

    const checkTokenExpiration = () => {
      if (isTokenExpired()) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('tokenTimestamp');
      }
    };

    checkTokenExpiration();

  }, [router]);

  return (
    <html lang="en">
      <title>{metadata.title}</title> 
      <meta name="description" content={metadata.description} />
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
        <ToastProvider>
          {children}
          <Toast />
        </ToastProvider>
      </body>
    </html>
  );
}
