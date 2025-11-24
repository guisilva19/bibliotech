'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/Loading';
import LoginComponent from '@/components/Login/page';
import { SidebarProvider } from '@/contexts/SidebarContext';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      // Quando o loading do AuthContext terminar, aguarda mais 300ms
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isLoading || showLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <LoginComponent />;
  }

  return <SidebarProvider>{children}</SidebarProvider>;
}

