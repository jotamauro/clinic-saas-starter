"use client";

import { patientSchema } from "@/schemas";
import { ZForm } from "@/components/Form";
import { useRouter } from "next/navigation";

export function NewPatientForm() {
    const router = useRouter();

    return (
        <ZForm
            schema={patientSchema}
            onSubmit={async (data) => {
                const res = await fetch("/api/patients", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                if (!res.ok) {
                    const txt = await res.text().catch(() => "");
                    throw new Error(`Erro ao criar paciente: ${res.status} ${txt}`);
                }
                router.refresh(); // re-renderiza a lista do server
            }}
            fields={[
                { name: "name", label: "Nome" },
                { name: "document", label: "Documento (opcional)" },
                { name: "email", label: "Email (opcional)" },
                { name: "phone", label: "Telefone (opcional)" },
            ]}
            submitLabel="Cadastrar"
        />
    );
}
