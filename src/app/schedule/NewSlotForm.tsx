"use client";

import { ZForm } from "@/components/Form";
import { slotSchema } from "@/schemas";

export function NewSlotForm() {
    return (
        <ZForm
            schema={slotSchema}
            onSubmit={async (data) => {
                const res = await fetch("/api/slots", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                if (!res.ok) {
                    const txt = await res.text().catch(() => "");
                    throw new Error(`POST /api/slots -> ${res.status} ${txt}`);
                }
                // atualiza a lista renderizada no server
                window.location.reload(); // ou useRouter().refresh()
            }}
            fields={[
                { name: "doctorId", label: "Médico ID" },
                { name: "weekday", label: "Dia da semana (0..6)" },
                { name: "startTime", label: "Início (HH:mm)" },
                { name: "endTime", label: "Fim (HH:mm)" },
                { name: "durationMin", label: "Duração (min)" },
            ]}
            submitLabel="Cadastrar"
        />
    );
}
