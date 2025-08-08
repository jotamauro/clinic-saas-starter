"use client";

import { ZForm } from "@/components/Form";
import { contractSchema } from "@/schemas";

export function CreateContractForm() {
    return (
        <ZForm
            schema={contractSchema}
            onSubmit={async (data) => {
                const res = await fetch("/api/contracts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                if (!res.ok) {
                    const txt = await res.text().catch(() => "");
                    throw new Error(`POST /api/contracts -> ${res.status} ${txt}`);
                }
                // Atualiza a tela
                window.location.reload();
            }}
            fields={[
                { name: "clinicId", label: "Clínica ID" },
                { name: "doctorId", label: "Médico ID" },
                { name: "startDate", label: "Início", type: "datetime-local" },
                { name: "endDate", label: "Fim (opcional)", type: "datetime-local" },
                { name: "revenueShare", label: "Repasse (0..1)" },
                { name: "isActive", label: "Ativo (true/false)" },
            ]}
            submitLabel="Cadastrar"
        />
    );
}
