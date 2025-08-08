"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { contractSchema } from "@/schemas";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

type Opt = { id: string; name: string };
type ContractInput = {
    id?: string;
    clinicId: string;
    doctorId: string;
    startDate: string; // datetime-local "YYYY-MM-DDTHH:mm"
    endDate: string;   // "" ou datetime-local
    revenueShare: string; // string para controlar o input
    isActive: "true" | "false";
};

export function NewContractForm({
    clinics, doctors, initialData, onSaved, onCancelEdit,
}: {
    clinics: Opt[]; doctors: Opt[];
    initialData?: ContractInput;
    onSaved?: () => void;
    onCancelEdit?: () => void;
}) {
    const router = useRouter();

    const [form, setForm] = useState<ContractInput>({
        clinicId: "", doctorId: "", startDate: "", endDate: "", revenueShare: "", isActive: "true",
    });

    // 🔧 SINCRONIZAÇÃO: sempre que receber um novo registro para editar, atualiza o form
    useEffect(() => {
        if (initialData) {
            setForm({
                clinicId: String(initialData.clinicId ?? ""),
                doctorId: String(initialData.doctorId ?? ""),
                startDate: initialData.startDate ?? "",
                endDate: initialData.endDate ?? "",
                revenueShare: initialData.revenueShare ?? "",
                isActive: (initialData.isActive ?? "true") as "true" | "false",
            });
        } else {
            // se saiu do modo edição, limpa
            setForm({ clinicId: "", doctorId: "", startDate: "", endDate: "", revenueShare: "", isActive: "true" });
        }
    }, [initialData]);

    const isEdit = Boolean(initialData?.id);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [createdInfo, setCreatedInfo] = useState<{ clinic?: string; doctor?: string } | null>(null);

    const clinicName = useMemo(() => clinics.find(c => c.id === form.clinicId)?.name, [clinics, form.clinicId]);
    const doctorName = useMemo(() => doctors.find(d => d.id === form.doctorId)?.name, [doctors, form.doctorId]);

    function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const payload = {
            clinicId: form.clinicId,
            doctorId: form.doctorId,
            startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
            endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
            revenueShare: form.revenueShare ? Number(form.revenueShare) : 0,
            isActive: form.isActive === "true",
        };

        const parsed = contractSchema.safeParse(payload);
        if (!parsed.success) {
            setError(parsed.error.issues?.[0]?.message ?? "Verifique os campos do contrato.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(isEdit ? `/api/contracts/${initialData!.id}` : "/api/contracts", {
                method: isEdit ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsed.data),
            });
            if (!res.ok) {
                const txt = await res.text().catch(() => "");
                let msg = txt; try { msg = JSON.parse(txt)?.error ?? txt; } catch { }
                throw new Error(msg || `Erro ao ${isEdit ? "atualizar" : "criar"} contrato`);
            }
            setCreatedInfo({ clinic: clinicName, doctor: doctorName });
            setShowSuccess(true);
            if (!isEdit) setForm({ clinicId: "", doctorId: "", startDate: "", endDate: "", revenueShare: "", isActive: "true" });
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
                <div className="grid gap-1">
                    <label className="text-sm">Clínica</label>
                    <select name="clinicId" value={form.clinicId} onChange={onChange} className="rounded border px-3 py-2" required>
                        <option value="">Selecione uma clínica</option>
                        {clinics.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                <div className="grid gap-1">
                    <label className="text-sm">Médico</label>
                    <select name="doctorId" value={form.doctorId} onChange={onChange} className="rounded border px-3 py-2" required>
                        <option value="">Selecione um médico</option>
                        {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>

                <div className="grid gap-1">
                    <label className="text-sm">Início</label>
                    <input
                        type="datetime-local"
                        name="startDate"
                        value={form.startDate}
                        onChange={onChange}
                        className="rounded border px-3 py-2"
                        required
                    />
                </div>

                <div className="grid gap-1">
                    <label className="text-sm">Fim (opcional)</label>
                    <input
                        type="datetime-local"
                        name="endDate"
                        value={form.endDate}
                        onChange={onChange}
                        className="rounded border px-3 py-2"
                    />
                </div>

                <div className="grid gap-1">
                    <label className="text-sm">Repasse (0..1)</label>
                    <input
                        type="number" step="0.01" min="0" max="1"
                        name="revenueShare"
                        value={form.revenueShare}
                        onChange={onChange}
                        placeholder="ex: 0.60"
                        className="rounded border px-3 py-2"
                        required
                    />
                </div>

                <div className="grid gap-1">
                    <label className="text-sm">Ativo</label>
                    <select name="isActive" value={form.isActive} onChange={onChange} className="rounded border px-3 py-2">
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                    </select>
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
                            {isEdit ? "Contrato atualizado!" : "Contrato cadastrado!"}
                        </h2>
                        {(clinicName || doctorName) && (
                            <p className="mt-1 text-sm text-gray-600">
                                {clinicName && <span className="font-medium">{clinicName}</span>}
                                {clinicName && doctorName && " • "}
                                {doctorName && <span className="font-medium">{doctorName}</span>}
                            </p>
                        )}
                        <button onClick={closeAndRefresh} className="mt-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg" autoFocus>
                            OK
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
