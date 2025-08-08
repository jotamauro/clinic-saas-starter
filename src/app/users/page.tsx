import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/Card";
import { UsersManager } from "./UsersManager";

export default async function UsersPage() {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (role !== "ADMIN") redirect("/dashboard");

    const clinics = await prisma.clinic.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
    });

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true },
    });

    return (
        <div className="grid gap-6">
            <Card>
                <CardTitle>Usuários (ADMIN)</CardTitle>
                <UsersManager initialUsers={users} initialClinics={clinics} />
            </Card>
        </div>
    );
}
