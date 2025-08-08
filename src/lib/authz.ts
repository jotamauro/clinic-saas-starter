// src/lib/authz.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function requireRole(roles: Array<"ADMIN" | "MANAGER" | "DOCTOR" | "RECEPTION">) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Response("Unauthorized", { status: 401 });
  const role = (session.user as any).role;
  if (!roles.includes(role)) throw new Response("Forbidden", { status: 403 });
  return session;
}
