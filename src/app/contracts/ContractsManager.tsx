"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ContractsTable } from "./ContractsTable";
import { NewContractForm } from "./NewContractForm";

type Row = {
    id: string;
    clinicId: string;
    clinicName: string;
    doctorId: string;
    doctorName: string;
    startDate: string; // ISO
    endDate: string;   // ISO | ""
    revenueShare: number;
    isActive: boolean;
};

type Opt = { id: string; name: string };

export function ContractsManager({
    initialContracts, clinics, doctors,
}: { initialContracts: Row[]; clinics: Opt[]; doctors: Opt[] }) {
    const router = useRouter();
    const [editing, setEditing] = useState<Row | null>(null);

    return (
        <div className="grid gap-6">
            {/* Form em cima */}
            <section className="rounded-lg border bg-white p-4">
                <h2 className="mb-3 text-lg font-semibold">
                    {editing ? "Editar Contrato" : "Novo Contrato"}
                </h2>
                <NewContractForm
                    clinics={clinics}
                    doctors={doctors}
                    initialData={editing ? {
                        id: editing.id,
                        clinicId: editing.clinicId,
                        doctorId: editing.doctorId,
                        // datetime-local precisa de formato local "YYYY-MM-DDTHH:mm"
                        startDate: toLocalInput(editing.startDate),
                        endDate: editing.endDate ? toLocalInput(editing.endDate) : "",
                        revenueShare: String(editing.revenueShare),
                        isActive: editing.isActive ? "true" : "false",
                    } : undefined}
                    onSaved={() => { setEditing(null); router.refresh(); }}
                    onCancelEdit={() => setEditing(null)}
                />
            </section>

            {/* Lista embaixo */}
            <section className="rounded-lg border bg-white p-4">
                <h2 className="mb-3 text-lg font-semibold">Contratos cadastrados</h2>
                <ContractsTable data={initialContracts} onEdit={(row) => setEditing(row)} />
            </section>
        </div>
    );
}

function toLocalInput(iso: string) {
    if (!iso) return "";
    // converte ISO -> "YYYY-MM-DDTHH:mm" no fuso local
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const h = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${y}-${m}-${day}T${h}:${min}`;
}
