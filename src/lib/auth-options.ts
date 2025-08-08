// src/lib/auth-options.ts
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            name: "credentials",
            credentials: { email: {}, password: {} },
            async authorize(creds) {
                if (!creds?.email || !creds.password) return null;
                const user = await prisma.user.findUnique({ where: { email: creds.email as string } });
                if (!user || !user.passwordHash) return null;
                const ok = await bcrypt.compare(creds.password as string, user.passwordHash);
                return ok ? { id: user.id, email: user.email, name: user.name, role: user.role } as any : null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.role = (user as any).role;
            return token;
        },
        async session({ session, token }) {
            (session.user as any).role = token.role;
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
};
