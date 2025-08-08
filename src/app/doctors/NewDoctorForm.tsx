"use client";

import { useEffect, useMemo, useState } from "react";
import { doctorSchema } from "@/schemas";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

type Opt = { id: string; name: string };

type DoctorInput = {
    id?: string;
    clinicId: string;
    name: string;
    crm: string;
    specialty: string;
    email?: string | null;
    phone?: string | null;
};

export function NewDoctorForm({
    clinics,
    initialData,
    onSaved,
    onCancelEdit,
}: {
    clinics: Opt[];
    initialData?: DoctorInput;
    onSaved?: () => void;
    onCancelEdit?: () => void;
}) {
    const [form, setForm] = useState<DoctorInput>({
        clinicId: "",
        name: "",
        crm: "",
        specialty: "",
        email: "",
        phone: "",
    });

    const isEdit = !!initialData?.id;

    useEffect(() => {
        if (initialData) setForm(initialData);
    }, [initialData]);

    const [showSuccess, setShowSuccess] = useState(false);
    const [who, setWho] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const clinicName = useMemo(
        () => clinics.find((c) => c.id === form.clinicId)?.name ?? "",
        [clinics, form.clinicId]
    );

    function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);

        const parsed = doctorSchema.safeParse({
            clinicId: form.clinicId,
            name: form.name,
            crm: form.crm,
            specialty: form.specialty,
            email: form.email ?? "",
            phone: form.phone ?? "",
        });
        if (!parsed.success) {
            setErr(parsed.error.issues?.[0]?.message ?? "Dados inválidos");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(
                isEdit ? `/api/doctors/${initialData!.id}` : "/api/doctors",
                {
                    method: isEdit ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(parsed.data),
                }
            );

            if (!res.ok) {
                const txt = await res.text().catch(() => "");
                let msg = txt;
                try { msg = JSON.parse(txt)?.error ?? txt; } catch { }
                throw new Error(msg || `Erro ${isEdit ? "ao atualizar" : "ao criar"} médico`);
            }

            setWho(parsed.data.name);
            setShowSuccess(true);

            // se for cadastro, limpa; se edição, mantém até fechar
            if (!isEdit) {
                setForm({ clinicId: "", name: "", crm: "", specialty: "", email: "", phone: "" });
            }
        } catch (e: any) {
            setErr(e?.message ?? "Erro ao salvar");
        } finally {
            setSubmitting(false);
        }
    }

    function closeSuccess() {
        setShowSuccess(false);
        onSaved?.();
    }

    return (
        <>
            <form onSubmit={onSubmit} className="grid gap-3">
                <div className="grid gap-1">
                    <label className="text-sm">Clínica</label>
                    <select
                        name="clinicId"
                        value={form.clinicId}
                        onChange={onChange}
                        className="rounded border px-3 py-2"
                        required
                    >
                        <option value="">Selecione uma clínica</option>
                        {clinics.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="grid gap-1">
                    <label className="text-sm">Nome</label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        className="rounded border px-3 py-2"
                        required
                    />
                </div>

                <div className="grid gap-1">
                    <label className="text-sm">CRM</label>
                    <input
                        name="crm"
                        value={form.crm}
                        onChange={onChange}
                        className="rounded border px-3 py-2"
                        required
                    // se quiser impedir edição do CRM:
                    // disabled={isEdit}
                    // title={isEdit ? "CRM não pode ser alterado" : undefined}
                    />
                </div>

                <div className="grid gap-1">
                    <label className="text-sm">Especialidade</label>
                    <input
                        name="specialty"
                        value={form.specialty}
                        onChange={onChange}
                        className="rounded border px-3 py-2"
                        required
                    />
                </div>

                <div className="grid gap-1">
                    <label className="text-sm">Email</label>
                    <input
                        name="email"
                        type="email"
                        value={form.email ?? ""}
                        onChange={onChange}
                        className="rounded border px-3 py-2"
                    />
                </div>

                <div className="grid gap-1">
                    <label className="text-sm">Telefone</label>
                    <input
                        name="phone"
                        value={form.phone ?? ""}
                        onChange={onChange}
                        className="rounded border px-3 py-2"
                    />
                </div>

                {err && <p className="text-sm text-red-600">{err}</p>}

                <div className="flex items-center gap-2">
                    <button
                        disabled={submitting}
                        className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-50"
                    >
                        {submitting ? "Salvando..." : isEdit ? "Atualizar" : "Cadastrar"}
                    </button>

                    {isEdit && (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            className="rounded border px-3 py-2"
                            disabled={submitting}
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            {showSuccess && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
                        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-lg font-semibold text-gray-800">
                            {isEdit ? "Médico atualizado!" : "Médico cadastrado!"}
                        </h2>
                        {who && <p className="text-gray-600 mt-1"><span className="font-medium">{who}</span> {clinicName && <>• {clinicName}</>}</p>}
                        <button
                            onClick={closeSuccess}
                            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                            autoFocus
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
