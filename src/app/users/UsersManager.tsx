"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { UsersTable } from "./UsersTable";
import { NewUserForm } from "./NewUserForm";

type Row = { id: string; name: string | null; email: string; role: "ADMIN" | "USER" };

export function UsersManager({ initialUsers, initialClinics, }: { initialUsers: Row[], initialClinics: Clinic[] }) {
    const router = useRouter();
    const [editing, setEditing] = useState<Row | null>(null);

    return (
        <div className="grid gap-6">
            <section className="rounded-lg border bg-white p-4">
                <h2 className="mb-3 text-lg font-semibold">{editing ? "Editar Usuário" : "Novo Usuário"}</h2>
                <NewUserForm
                    clinics={initialClinics}
                    initialData={
                        editing
                            ? { id: editing.id, name: editing.name ?? "", email: editing.email, role: editing.role, password: "" }
                            : undefined
                    }
                    onSaved={() => { setEditing(null); router.refresh(); }}
                    onCancelEdit={() => setEditing(null)}
                />
            </section>

            <section className="rounded-lg border bg-white p-4">
                <h2 className="mb-3 text-lg font-semibold">Usuários cadastrados</h2>
                <UsersTable data={initialUsers} onEdit={setEditing} />
            </section>
        </div>
    );
}
