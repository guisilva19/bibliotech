import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Bibliotech",
  description: "Bibliotech é uma plataforma de gerenciamento de biblioteca",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${poppins.className} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
