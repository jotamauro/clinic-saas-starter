// src/app/appointments/NewAppointmentForm.tsx
"use client";

import { ZForm } from "@/components/Form";
import { appointmentSchema } from "@/schemas";
import { useRouter } from "next/navigation";

export function NewAppointmentForm() {
    const router = useRouter();

    return (
        <ZForm
            schema={appointmentSchema}
            onSubmit={async (data) => {
                const res = await fetch("/api/appointments", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                if (!res.ok) {
                    const txt = await res.text().catch(() => "");
                    throw new Error(`Erro ao criar consulta: ${res.status} ${txt}`);
                }
                router.refresh(); // atualiza a lista do server
            }}
            fields={[
                { name: "clinicId", label: "Clínica ID" },
                { name: "doctorId", label: "Médico ID" },
                { name: "patientId", label: "Paciente ID" },
                { name: "startsAt", label: "Início", type: "datetime-local" },
            ]}
            submitLabel="Agendar"
        />
    );
}
