"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { NewDoctorForm } from "./NewDoctorForm";
import { DoctorsTable } from "./DoctorsTable";

type DoctorRow = {
    id: string;
    name: string;
    crm: string;
    specialty: string;
    email: string | null;
    phone: string | null;
    clinicId: string | null;
    clinicName: string | null;
};

type Opt = { id: string; name: string };

export function DoctorsManager({
    initialDoctors,
    clinics,
}: {
    initialDoctors: DoctorRow[];
    clinics: Opt[];
}) {
    const router = useRouter();
    const [editing, setEditing] = useState<DoctorRow | null>(null);

    return (
        <div className="grid gap-6">
            {/* Form em cima */}
            <section className="rounded-lg border bg-white p-4">
                <h2 className="mb-3 text-lg font-semibold">
                    {editing ? "Editar Médico" : "Novo Médico"}
                </h2>

                <NewDoctorForm
                    clinics={clinics}
                    initialData={
                        editing
                            ? {
                                id: editing.id,
                                clinicId: editing.clinicId ?? "",
                                name: editing.name,
                                crm: editing.crm,
                                specialty: editing.specialty,
                                email: editing.email ?? "",
                                phone: editing.phone ?? "",
                            }
                            : undefined
                    }
                    onSaved={() => {
                        setEditing(null);
                        router.refresh(); // atualiza lista
                    }}
                    onCancelEdit={() => setEditing(null)}
                />
            </section>

            {/* Lista embaixo */}
            <section className="rounded-lg border bg-white p-4">
                <h2 className="mb-3 text-lg font-semibold">Médicos cadastrados</h2>
                <DoctorsTable
                    data={initialDoctors}
                    onEdit={(row) => setEditing(row)}
                />
            </section>
        </div>
    );
}
