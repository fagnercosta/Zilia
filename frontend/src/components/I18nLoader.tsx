"use client";
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function I18nLoader({ children }: { children: React.ReactNode }) {
  const { ready } = useTranslation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (ready) {
      setIsReady(true);
    }
  }, [ready]);

  if (!isReady) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-lg">Loading...</div>
    </div>;
  }

  return <>{children}</>;
}