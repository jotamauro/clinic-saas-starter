import "./globals.css";
import type { ReactNode } from "react";
import Providers from "./providers";
import Header from "@/components/layout/Header";
import AuthGuard from "@/components/layout/AuthGuard";

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50">
        <Providers>
          <AuthGuard>
            <Header />
            <main className="mx-auto max-w-7xl p-4">{children}</main>
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
