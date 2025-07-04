"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import cookie from 'cookie';

interface AuthContextProps {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Recupera o token do localStorage e cookies ao carregar o componente
    const storedToken = localStorage.getItem("token");
    const cookies = cookie.parse(document.cookie);
    const authToken = cookies.authToken || storedToken;

    if (authToken) {
      setToken(authToken);
      localStorage.setItem("token", authToken); // Garante que o token esteja no localStorage
    } else {
      router.push("/login");
    }
  }, [router]);

  const login = (newToken: string) => {
    // Armazenar o token no localStorage e no cookie
    localStorage.setItem("token", newToken);
    document.cookie = cookie.serialize('authToken', newToken, {
      httpOnly: false, // Permitir acesso via JS
      secure: process.env.NODE_ENV !== 'development', // Somente HTTPS em produção
      path: '/',
    });
    setToken(newToken);
    router.push("/");
  };

  const logout = () => {
    // Remover o token do localStorage e do cookie
    localStorage.removeItem("token");
    
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");
    localStorage.removeItem("email");
    document.cookie = cookie.serialize('authToken', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: -1, // Expira imediatamente
      path: '/',
    });
    setToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};