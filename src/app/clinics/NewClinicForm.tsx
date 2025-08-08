"use client";

import { useEffect, useState } from "react";
import { clinicSchema } from "@/schemas";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

type ClinicInput = {
    id?: string;         // presente no modo editar
    name: string;
    document: string;
    phone?: string | null;
    address?: string | null;
};

export function NewClinicForm({
    initialData,
    onSaved,
    onCancelEdit,
}: {
    initialData?: ClinicInput;
    onSaved?: () => void;
    onCancelEdit?: () => void;
}) {
    const [form, setForm] = useState<ClinicInput>({
        name: "",
        document: "",
        phone: "",
        address: "",
    });

    const isEdit = !!initialData?.id;

    useEffect(() => {
        if (initialData) setForm(initialData);
    }, [initialData]);

    const [showSuccess, setShowSuccess] = useState(false);
    const [createdName, setCreatedName] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);

        // valida com Zod
        const parsed = clinicSchema.safeParse({
            name: form.name,
            document: form.document,
            phone: form.phone ?? "",
            address: form.address ?? "",
        });
        if (!parsed.success) {
            setErr(parsed.error.issues?.[0]?.message ?? "Dados inválidos");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(
                isEdit ? `/api/clinics/${initialData!.id}` : "/api/clinics",
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
                throw new Error(msg || `Erro ${isEdit ? "ao atualizar" : "ao criar"} clínica`);
            }

            setCreatedName(parsed.data.name);
            setShowSuccess(true);
            // limpa o form se for cadastro; se for edição, mantém campos mas fecha no OK
            if (!isEdit) {
                setForm({ name: "", document: "", phone: "", address: "" });
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
                    value={form.document}
                    onChange={onChange}
                    placeholder="Documento (CNPJ)"
                    className="rounded border px-3 py-2"
                    required
                    disabled={isEdit} // CNPJ travado na edição
                    title={isEdit ? "Este campo não pode ser alterado" : undefined}
                />
                <input
                    name="phone"
                    value={form.phone ?? ""}
                    onChange={onChange}
                    placeholder="Telefone"
                    className="rounded border px-3 py-2"
                />
                <input
                    name="address"
                    value={form.address ?? ""}
                    onChange={onChange}
                    placeholder="Endereço"
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
                        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-lg font-semibold text-gray-800">
                            {isEdit ? "Clínica atualizada!" : "Clínica cadastrada!"}
                        </h2>
                        {createdName && (
                            <p className="text-gray-600 mt-1">
                                <span className="font-medium">{createdName}</span>
                            </p>
                        )}
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
