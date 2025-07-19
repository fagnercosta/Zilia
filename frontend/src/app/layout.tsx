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
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import I18nLoader from '@/components/I18nLoader';

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
        <I18nextProvider i18n={i18n}>
          <I18nLoader>
            <AuthProvider>
              <ToastProvider>
                {children}
                <Toast />
              </ToastProvider>
            </AuthProvider>
          </I18nLoader>
        </I18nextProvider>
      </body>
    </html>
  );
}
