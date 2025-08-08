"use client";

import { useEffect, useState } from "react";
import { patientSchema } from "@/schemas";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

type PatientInput = {
    id?: string;
    name: string;
    document?: string | null;
    email?: string | null;
    phone?: string | null;
};

export function NewPatientForm({
    initialData,
    onSaved,
    onCancelEdit,
}: {
    initialData?: PatientInput;
    onSaved?: () => void;
    onCancelEdit?: () => void;
}) {
    const [form, setForm] = useState<PatientInput>({
        name: "",
        document: "",
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

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);

        // valida com Zod (ajuste conforme seu schema aceitar vazios)
        const parsed = patientSchema.safeParse({
            name: form.name,
            document: form.document ?? "",
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
                isEdit ? `/api/patients/${initialData!.id}` : "/api/patients",
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
                throw new Error(msg || `Erro ${isEdit ? "ao atualizar" : "ao criar"} paciente`);
            }

            setWho(parsed.data.name);
            setShowSuccess(true);

            // se for cadastro, limpa o form; se edição, mantém até fechar
            if (!isEdit) {
                setForm({ name: "", document: "", email: "", phone: "" });
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
                <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Nome"
                    className="rounded border px-3 py-2"
                    required
                />
                <input
                    name="document"
                    value={form.document ?? ""}
                    onChange={onChange}
                    placeholder="Documento (opcional)"
                    className="rounded border px-3 py-2"
                    disabled={isEdit}
                />
                <input
                    name="email"
                    type="email"
                    value={form.email ?? ""}
                    onChange={onChange}
                    placeholder="Email (opcional)"
                    className="rounded border px-3 py-2"
                />
                <input
                    name="phone"
                    value={form.phone ?? ""}
                    onChange={onChange}
                    placeholder="Telefone (opcional)"
                    className="rounded border px-3 py-2"
                />

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
                        <svg viewBox="0 0 24 24" className="h-16 w-16 text-green-500 mx-auto mb-4 fill-current">
                            <path d="M9 16.2l-3.5-3.5L4 14.2 9 19l12-12-1.5-1.5z" />
                        </svg>
                        <h2 className="text-lg font-semibold text-gray-800">
                            {isEdit ? "Paciente atualizado!" : "Paciente cadastrado!"}
                        </h2>
                        {who && <p className="text-gray-600 mt-1"><span className="font-medium">{who}</span></p>}
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
