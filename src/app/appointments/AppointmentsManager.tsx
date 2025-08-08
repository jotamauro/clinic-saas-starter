"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { NewAppointmentForm } from "./NewAppointmentForm";
import { AppointmentsTable } from "./AppointmentsTable";

type Row = {
    id: string;
    clinicId: string; clinicName: string;
    doctorId: string; doctorName: string;
    patientId: string; patientName: string;
    startsAtISO: string;
    status: string;
};

type Opt = { id: string; name: string };

export function AppointmentsManager({
    initialAppointments, clinics, doctors, patients,
}: {
    initialAppointments: Row[];
    clinics: Opt[];
    doctors: Opt[];
    patients: Opt[];
}) {
    const router = useRouter();
    const [editing, setEditing] = useState<Row | null>(null);

    return (
        <div className="grid gap-6">
            {/* Form em cima */}
            <section className="rounded-lg border bg-white p-4">
                <h2 className="mb-3 text-lg font-semibold">
                    {editing ? "Editar Consulta" : "Nova Consulta"}
                </h2>
                <NewAppointmentForm
                    clinics={clinics}
                    doctors={doctors}
                    patients={patients}
                    initialData={
                        editing ? {
                            id: editing.id,
                            clinicId: editing.clinicId,
                            doctorId: editing.doctorId,
                            patientId: editing.patientId,
                            startsAt: toLocalInput(editing.startsAtISO),
                            status: editing.status ?? "SCHEDULED",
                        } : undefined
                    }
                    onSaved={() => { setEditing(null); router.refresh(); }}
                    onCancelEdit={() => setEditing(null)}
                />
            </section>

            {/* Lista embaixo */}
            <section className="rounded-lg border bg-white p-4">
                <h2 className="mb-3 text-lg font-semibold">Consultas cadastradas</h2>
                <AppointmentsTable data={initialAppointments} onEdit={(row) => setEditing(row)} />
            </section>
        </div>
    );
}

function toLocalInput(iso: string) {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
