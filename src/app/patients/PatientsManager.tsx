"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { NewPatientForm } from "./NewPatientForm";
import { PatientsTable } from "./PatientsTable";

type Patient = {
    id: string;
    name: string;
    document: string | null;
    email: string | null;
    phone: string | null;
};

export function PatientsManager({ initialPatients }: { initialPatients: Patient[] }) {
    const router = useRouter();
    const [editing, setEditing] = useState<Patient | null>(null);

    return (
        <div className="grid gap-6">
            {/* Form em cima */}
            <section className="rounded-lg border bg-white p-4">
                <h2 className="mb-3 text-lg font-semibold">
                    {editing ? "Editar Paciente" : "Novo Paciente"}
                </h2>

                <NewPatientForm
                    initialData={editing ? {
                        id: editing.id,
                        name: editing.name ?? "",
                        document: editing.document ?? "",
                        email: editing.email ?? "",
                        phone: editing.phone ?? "",
                    } : undefined}
                    onSaved={() => {
                        setEditing(null);
                        router.refresh();
                    }}
                    onCancelEdit={() => setEditing(null)}
                />
            </section>

            {/* Lista embaixo */}
            <section className="rounded-lg border bg-white p-4">
                <h2 className="mb-3 text-lg font-semibold">Pacientes cadastrados</h2>
                <PatientsTable
                    data={initialPatients}
                    onEdit={(row) => setEditing(row)}
                />
            </section>
        </div>
    );
}
