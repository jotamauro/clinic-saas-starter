"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserAvatarMenu } from "./UserAvatarMenu";

export default function Header() {
    const { data: session, status } = useSession();
    const user = session?.user as any; // { name, email, image, role? }

    return (
        <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <nav className="flex flex-wrap gap-4 text-sm">
                        {user?.role === "ADMIN" && <Link href="/users" className="text-sm font-semibold">Usuários</Link>}

                        <Link href="/dashboard" className="text-sm font-semibold">Dashboard</Link>
                        <Link href="/clinics" className="text-sm font-semibold">Clínicas</Link>
                        <Link href="/patients" className="text-sm font-semibold">Pacientes</Link>
                        <Link href="/doctors" className="text-sm font-semibold">Médicos</Link>
                        <Link href="/contracts" className="text-sm font-semibold">Contratos</Link>
                        <Link href="/schedule" className="text-sm font-semibold">Agenda</Link>
                        <Link href="/appointments" className="text-sm font-semibold">Consultas</Link>

                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    {status === "loading" ? (
                        <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
                    ) : user && (
                        <UserAvatarMenu user={user} />
                    )}
                </div>
            </div>
        </header>
    );
}
