"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";

type UserInfo = {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
};

export function UserAvatarMenu({ user }: { user: UserInfo }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onClickOutside(e: MouseEvent) {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) setOpen(false);
        }
        window.addEventListener("click", onClickOutside);
        return () => window.removeEventListener("click", onClickOutside);
    }, []);

    const initials =
        (user?.name || user?.email || "?")
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border bg-gray-100"
                aria-label="Abrir menu do usuário"
            >
                {user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.image} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                    <span className="text-xs font-semibold text-gray-700">{initials}</span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg border bg-white p-3 shadow-lg">
                    <div className="flex items-center gap-3 p-2">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border bg-gray-100">
                            {user?.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={user.image} alt="avatar" className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-sm font-semibold text-gray-700">{initials}</span>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-900">{user?.name ?? "Usuário"}</p>
                            <p className="truncate text-xs text-gray-500">{user?.email ?? "—"}</p>
                            {user?.role && <p className="truncate text-xs text-gray-500">Role: {user.role}</p>}
                        </div>
                    </div>

                    <div className="mt-2 border-t pt-2">
                        <button
                            onClick={() => signOut({ callbackUrl: "/login", redirect: true })}
                            className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
