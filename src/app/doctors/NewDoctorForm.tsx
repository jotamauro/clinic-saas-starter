"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doctorSchema } from "@/schemas";

type ClinicOption = { id: string; name: string };

export function NewDoctorForm() {
    const router = useRouter();
    const [clinics, setClinics] = useState<ClinicOption[]>([]);
    const [loadingClinics, setLoadingClinics] = useState(true);
    const [form, setForm] = useState({
        clinicId: "",
        name: "",
        crm: "",
        specialty: "",
        email: "",
        phone: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/clinics", { cache: "no-store" });
                const data = await res.json();
                setClinics(data.map((c: any) => ({ id: c.id, name: c.name })));
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingClinics(false);
            }
        })();
    }, []);

    function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        // valida com Zod no client
        const parsed = doctorSchema.safeParse(form);
        if (!parsed.success) {
            setError("Preencha os campos corretamente.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/doctors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsed.data),
            });
            if (!res.ok) {
                const txt = await res.text().catch(() => "");
                throw new Error(`Erro ao criar médico: ${res.status} ${txt}`);
            }
            // limpa e atualiza a lista
            setForm({ clinicId: "", name: "", crm: "", specialty: "", email: "", phone: "" });
            router.refresh();
        } catch (err: any) {
            setError(err.message ?? "Erro ao salvar.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-1">
                <label className="text-sm">Clínica</label>
                <select
                    name="clinicId"
                    value={form.clinicId}
                    onChange={onChange}
                    className="rounded border px-3 py-2"
                    disabled={loadingClinics}
                    required
                >
                    <option value="">{loadingClinics ? "Carregando..." : "Selecione uma clínica"}</option>
                    {clinics.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid gap-1">
                <label className="text-sm">Nome</label>
                <input name="name" value={form.name} onChange={onChange} className="rounded border px-3 py-2" required />
            </div>

            <div className="grid gap-1">
                <label className="text-sm">CRM</label>
                <input name="crm" value={form.crm} onChange={onChange} className="rounded border px-3 py-2" required />
            </div>

            <div className="grid gap-1">
                <label className="text-sm">Especialidade</label>
                <input name="specialty" value={form.specialty} onChange={onChange} className="rounded border px-3 py-2" required />
            </div>

            <div className="grid gap-1">
                <label className="text-sm">Email</label>
                <input name="email" type="email" value={form.email} onChange={onChange} className="rounded border px-3 py-2" />
            </div>

            <div className="grid gap-1">
                <label className="text-sm">Telefone</label>
                <input name="phone" value={form.phone} onChange={onChange} className="rounded border px-3 py-2" />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
                disabled={submitting}
                className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-50"
            >
                {submitting ? "Salvando..." : "Cadastrar"}
            </button>
        </form>
    );
}
