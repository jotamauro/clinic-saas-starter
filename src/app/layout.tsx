import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="min-h-dvh bg-gray-50 text-gray-900">
        <header className="sticky top-0 bg-white/70 backdrop-blur border-b">
          <div className="container flex h-14 items-center justify-between">
            <Link href="/" className="font-bold">ClinicSaaS</Link>
            <nav className="flex flex-wrap gap-4 text-sm">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/clinics">Clínicas</Link>
              <Link href="/patients">Pacientes</Link>
              <Link href="/doctors">Médicos</Link>
              <Link href="/contracts">Contratos</Link>
              <Link href="/schedule">Agenda</Link>
              <Link href="/appointments">Consultas</Link>
            </nav>
          </div>
        </header>
        <main className="container py-6">{children}</main>
        <footer className="border-t mt-10 py-6 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} ClinicSaaS
        </footer>
      </body>
    </html>
  );
}
