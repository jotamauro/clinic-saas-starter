"use client";

import { clinicSchema } from "@/schemas";
import { ZForm } from "@/components/Form";
import { useRouter } from "next/navigation";

export function NewClinicForm() {
    const router = useRouter();

    return (
        <ZForm
            schema={clinicSchema}
            onSubmit={async (data) => {
                const res = await fetch("/api/clinics", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });

                if (!res.ok) {
                    const txt = await res.text().catch(() => "");
                    throw new Error(`Erro ao criar clínica: ${res.status} ${txt}`);
                }

                // re-renderiza o Server Component com a lista atualizada
                router.refresh();
            }}
            fields={[
                { name: "name", label: "Nome" },
                { name: "document", label: "Documento (CNPJ)" },
                { name: "phone", label: "Telefone" },
                { name: "address", label: "Endereço" },
            ]}
            submitLabel="Cadastrar"
        />
    );
}
