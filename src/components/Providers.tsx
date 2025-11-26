"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { StatsProvider } from "@/contexts/StatsContext";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <StatsProvider>
        <Toaster position="top-right" />
        {children}
      </StatsProvider>
    </AuthProvider>
  );
}



