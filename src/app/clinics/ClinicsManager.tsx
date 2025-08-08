"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NewClinicForm } from "./NewClinicForm";
import { ClinicsTable } from "./ClinicsTable";

type Clinic = {
    id: string;
    name: string;
    document: string | null;
    phone: string | null;
    address: string | null;
};

export function ClinicsManager({ initialClinics }: { initialClinics: Clinic[] }) {
    const router = useRouter();
    const [editing, setEditing] = useState<Clinic | null>(null);

    return (
        <div className="grid gap-6">
            {/* Form em cima */}
            <section className="rounded-lg border bg-white p-4">
                <h2 className="mb-3 text-lg font-semibold">
                    {editing ? "Editar Clínica" : "Nova Clínica"}
                </h2>
                <NewClinicForm
                    initialData={editing ? {
                        id: editing.id,
                        name: editing.name ?? "",
                        document: editing.document ?? "",
                        phone: editing.phone ?? "",
                        address: editing.address ?? "",
                    } : undefined}
                    onSaved={() => {
                        setEditing(null);
                        router.refresh(); // atualiza a listagem abaixo
                    }}
                    onCancelEdit={() => setEditing(null)}
                />
            </section>

            {/* Lista embaixo */}
            <section className="rounded-lg border bg-white p-4">
                <h2 className="mb-3 text-lg font-semibold">Clínicas cadastradas</h2>
                <ClinicsTable
                    data={initialClinics}
                    onEdit={(row) => setEditing(row)}
                />
            </section>
        </div>
    );
}
