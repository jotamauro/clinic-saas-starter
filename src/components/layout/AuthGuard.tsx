// src/components/layout/AuthGuard.tsx
"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const PUBLIC_PATHS = new Set<string>([
    "/login",
    "/register",
    "/forgot-password",
]);

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    const isPublic = PUBLIC_PATHS.has(pathname) || pathname.startsWith("/api");

    useEffect(() => {
        if (status === "unauthenticated" && !isPublic) {
            // evita callbackUrl=/login
            const cb = pathname && pathname !== "/login" ? pathname : "/";
            router.replace(`/login?callbackUrl=${encodeURIComponent(cb)}`);
        }
    }, [status, isPublic, pathname, router]);

    if (isPublic) return <>{children}</>;

    if (status === "loading") {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900" />
            </div>
        );
    }

    if (status === "unauthenticated") return null; // enquanto redireciona

    return <>{children}</>;
}
