"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SlotsTable } from "./SlotsTable";
import { NewSlotForm } from "./NewSlotForm";

type Row = {
    id: string;
    doctorId: string;
    doctorName: string;
    weekday: number;
    startTime: string;
    endTime: string;
    durationMin: number;
};

type Opt = { id: string; name: string };

export function SlotsManager({
    initialSlots, doctors,
}: { initialSlots: Row[]; doctors: Opt[] }) {
    const router = useRouter();
    const [editing, setEditing] = useState<Row | null>(null);

    return (
        <div className="grid gap-6">
            {/* Form em cima */}
            <section className="rounded-lg border bg-white p-4">
                <h2 className="mb-3 text-lg font-semibold">
                    {editing ? "Editar Agenda (Slot)" : "Novo Slot"}
                </h2>

                <NewSlotForm
                    doctors={doctors}
                    initialData={editing ? {
                        id: editing.id,
                        doctorId: editing.doctorId,
                        weekday: String(editing.weekday),          // select trabalha com string
                        startTime: editing.startTime,
                        endTime: editing.endTime,
                        durationMin: String(editing.durationMin),  // input controla como string
                    } : undefined}
                    onSaved={() => { setEditing(null); router.refresh(); }}
                    onCancelEdit={() => setEditing(null)}
                />
            </section>

            {/* Lista embaixo */}
            <section className="rounded-lg border bg-white p-4">
                <h2 className="mb-3 text-lg font-semibold">Slots cadastrados</h2>
                <SlotsTable data={initialSlots} onEdit={(row) => setEditing(row)} />
            </section>
        </div>
    );
}
