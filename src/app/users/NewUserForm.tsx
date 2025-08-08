"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

type UserInput = {
    id?: string;
    name: string;
    email: string;
    role: "ADMIN" | "MANAGER" | "DOCTOR" | "RECEPTION";
    password?: string; // opcional em edição
};

type Clinic = { id: string; name: string };

export function NewUserForm({
    initialData,
    clinics,
    onSaved,
    onCancelEdit,
}: {
    initialData?: UserInput;
    clinics: Clinic[];
    onSaved?: () => void;
    onCancelEdit?: () => void;
}) {
    const router = useRouter();
    const [form, setForm] = useState<UserInput & { clinicId?: string }>({
        name: "",
        email: "",
        role: "RECEPTION",
        password: "",
        clinicId: undefined,
    });
    const isEdit = Boolean(initialData?.id);

    useEffect(() => {
        if (initialData) {
            setForm({ name: initialData.name ?? "", email: initialData.email, role: initialData.role, password: "" });
        } else {
            setForm({ name: "", email: "", role: "RECEPTION", password: "" });
        }
    }, [initialData]);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [who, setWho] = useState<string | null>(null);

    function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value as any }));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        // validações simples
        if (!form.email) return setError("Email é obrigatório.");
        if (!isEdit && !form.password) return setError("Senha é obrigatória no cadastro.");

        setSubmitting(true);
        try {
            const res = await fetch(isEdit ? `/api/users/${initialData!.id}` : "/api/users", {
                method: isEdit ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    role: form.role,
                    clinicId: form.clinicId,      // ← novo
                    password: form.password || undefined,
                }),
            });
            if (!res.ok) {
                const txt = await res.text().catch(() => "");
                let msg = txt; try { msg = JSON.parse(txt)?.error ?? txt; } catch { }
                throw new Error(msg || `Erro ao ${isEdit ? "atualizar" : "criar"} usuário`);
            }

            setWho(form.email);
            setShowSuccess(true);
            if (!isEdit) setForm({ name: "", email: "", role: "RECEPTION", password: "" });
        } catch (err: any) {
            setError(err?.message ?? "Erro ao salvar.");
        } finally {
            setSubmitting(false);
        }
    }

    function closeAndRefresh() {
        setShowSuccess(false);
        onSaved?.();
        router.refresh();
    }

    return (
        <>
            <form onSubmit={onSubmit} className="grid gap-3">
                <label className="block text-sm font-medium text-gray-700">Clínica</label>
                <select
                    className="rounded border px-3 py-2"
                    value={form.clinicId ?? ""}
                    onChange={(e) => setForm(s => ({ ...s, clinicId: e.target.value || undefined }))}
                >
                    <option value="">Selecione uma clínica</option>
                    {clinics.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                <div className="grid gap-1">
                    <label className="text-sm">Nome</label>
                    <input name="name" value={form.name} onChange={onChange} className="rounded border px-3 py-2" />
                </div>

                <div className="grid gap-1">
                    <label className="text-sm">Email</label>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={onChange}
                        className="rounded border px-3 py-2"
                        required
                        disabled={isEdit} // email não editável
                        title={isEdit ? "Email não pode ser alterado" : undefined}
                    />
                </div>

                <div className="grid gap-1">
                    <label className="text-sm">Role</label>
                    <select
                        name="role"
                        value={form.role}
                        onChange={onChange}
                        className="rounded border px-3 py-2"
                    >
                        <option value="ADMIN">ADMIN</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="DOCTOR">DOCTOR</option>
                        <option value="RECEPTION">RECEPTION</option>
                    </select>
                </div>

                <div className="grid gap-1">
                    <label className="text-sm">{isEdit ? "Nova senha (opcional)" : "Senha"}</label>
                    <input
                        name="password"
                        type="password"
                        value={form.password ?? ""}
                        onChange={onChange}
                        className="rounded border px-3 py-2"
                        placeholder={isEdit ? "Deixe em branco para manter a atual" : ""}
                    />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="flex items-center gap-2">
                    <button disabled={submitting} className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-50">
                        {submitting ? "Salvando..." : isEdit ? "Atualizar" : "Cadastrar"}
                    </button>
                    {isEdit && (
                        <button type="button" onClick={onCancelEdit} className="rounded border px-3 py-2" disabled={submitting}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true"
                    onClick={(e) => { if (e.target === e.currentTarget) closeAndRefresh(); }}
                    onKeyDown={(e) => { if (e.key === "Escape") closeAndRefresh(); }}>
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center shadow-lg">
                        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-lg font-semibold text-gray-800">
                            {isEdit ? "Usuário atualizado!" : "Usuário cadastrado!"}
                        </h2>
                        {who && <p className="mt-1 text-sm text-gray-600"><span className="font-medium">{who}</span></p>}
                        <button onClick={closeAndRefresh} className="mt-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg" autoFocus>
                            OK
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
