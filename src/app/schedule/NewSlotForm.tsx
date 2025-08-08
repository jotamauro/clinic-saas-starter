"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
// import { slotSchema } from "@/schemas"; // se quiser validar
import { CheckCircleIcon } from "@heroicons/react/24/solid";

type Opt = { id: string; name: string };
type SlotInput = {
    id?: string;
    doctorId: string;
    weekday: string;      // "0".."6"
    startTime: string;    // "HH:mm"
    endTime: string;      // "HH:mm"
    durationMin: string;  // string para o input
};

export function NewSlotForm({
    doctors, initialData, onSaved, onCancelEdit,
}: {
    doctors: Opt[];
    initialData?: SlotInput;
    onSaved?: () => void;
    onCancelEdit?: () => void;
}) {
    const router = useRouter();
    const [form, setForm] = useState<SlotInput>({
        doctorId: "", weekday: "", startTime: "", endTime: "", durationMin: "",
    });
    const isEdit = Boolean(initialData?.id);

    // 🔧 SINCRONIZAÇÃO: sempre que mudar o item em edição, atualiza o form
    useEffect(() => {
        if (initialData) {
            setForm({
                doctorId: initialData.doctorId ?? "",
                weekday: initialData.weekday ?? "",
                startTime: initialData.startTime ?? "",
                endTime: initialData.endTime ?? "",
                durationMin: initialData.durationMin ?? "",
            });
        } else {
            setForm({ doctorId: "", weekday: "", startTime: "", endTime: "", durationMin: "" });
        }
    }, [initialData]);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [showSuccess, setShowSuccess] = useState(false);
    const [createdInfo, setCreatedInfo] = useState<{ doctor?: string; summary?: string } | null>(null);

    const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const doctorName = useMemo(() => doctors.find(d => d.id === form.doctorId)?.name, [doctors, form.doctorId]);

    function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const payload = {
            doctorId: form.doctorId,
            weekday: Number(form.weekday),
            startTime: form.startTime,
            endTime: form.endTime,
            durationMin: Number(form.durationMin || 0),
        };

        // Validação opcional com Zod
        // const parsed = slotSchema.safeParse(payload);
        // if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Verifique os campos."); return; }

        setSubmitting(true);
        try {
            const res = await fetch(isEdit ? `/api/slots/${initialData!.id}` : "/api/slots", {
                method: isEdit ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload), // ou parsed.data
            });
            if (!res.ok) {
                const txt = await res.text().catch(() => "");
                let msg = txt; try { msg = JSON.parse(txt)?.error ?? txt; } catch { }
                throw new Error(msg || `Erro ao ${isEdit ? "atualizar" : "criar"} slot`);
            }

            setCreatedInfo({
                doctor: doctorName,
                summary: `${weekdays[Number(form.weekday)]} • ${form.startTime}–${form.endTime} • ${form.durationMin}min`,
            });
            setShowSuccess(true);

            if (!isEdit) {
                setForm({ doctorId: "", weekday: "", startTime: "", endTime: "", durationMin: "" });
            }
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
                    <label className="text-sm">Médico</label>
                    <select
                        name="doctorId"
                        value={form.doctorId}
                        onChange={onChange}
                        className="rounded border px-3 py-2"
                        required
                    >
                        <option value="">Selecione um médico</option>
                        {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>

                <div className="grid gap-1">
                    <label className="text-sm">Dia da semana</label>
                    <select
                        name="weekday"
                        value={form.weekday}
                        onChange={onChange}
                        className="rounded border px-3 py-2"
                        required
                    >
                        <option value="">Selecione o dia</option>
                        {weekdays.map((w, i) => <option key={i} value={i}>{w}</option>)}
                    </select>
                </div>

                <div className="grid gap-1">
                    <label className="text-sm">Início (HH:mm)</label>
                    <input
                        name="startTime"
                        value={form.startTime}
                        onChange={onChange}
                        placeholder="08:00"
                        className="rounded border px-3 py-2"
                        required
                    />
                </div>

                <div className="grid gap-1">
                    <label className="text-sm">Fim (HH:mm)</label>
                    <input
                        name="endTime"
                        value={form.endTime}
                        onChange={onChange}
                        placeholder="12:00"
                        className="rounded border px-3 py-2"
                        required
                    />
                </div>

                <div className="grid gap-1">
                    <label className="text-sm">Duração (min)</label>
                    <input
                        name="durationMin"
                        value={form.durationMin}
                        onChange={onChange}
                        placeholder="30"
                        className="rounded border px-3 py-2"
                        required
                    />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

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
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => { if (e.target === e.currentTarget) closeAndRefresh(); }}
                    onKeyDown={(e) => { if (e.key === "Escape") closeAndRefresh(); }}
                >
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center shadow-lg">
                        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-lg font-semibold text-gray-800">
                            {isEdit ? "Agenda atualizada!" : "Agenda cadastrada!"}
                        </h2>
                        {(createdInfo?.doctor || createdInfo?.summary) && (
                            <p className="mt-1 text-sm text-gray-600">
                                {createdInfo?.doctor && <span className="font-medium">{createdInfo.doctor}</span>}
                                {createdInfo?.doctor && createdInfo?.summary && " • "}
                                {createdInfo?.summary}
                            </p>
                        )}
                        <button
                            onClick={closeAndRefresh}
                            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
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
