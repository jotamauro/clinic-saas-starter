"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
// import { appointmentSchema } from "@/schemas"; // opcional
import { CheckCircleIcon } from "@heroicons/react/24/solid";

type Opt = { id: string; name: string };
type AppointmentInput = {
    id?: string;
    clinicId: string;
    doctorId: string;
    patientId: string;
    startsAt: string; // datetime-local
    status?: string;  // opcional, se quiser editar status
};

export function NewAppointmentForm({
    clinics, doctors, patients, initialData, onSaved, onCancelEdit,
}: {
    clinics: Opt[]; doctors: Opt[]; patients: Opt[];
    initialData?: AppointmentInput;
    onSaved?: () => void;
    onCancelEdit?: () => void;
}) {
    const router = useRouter();
    const [form, setForm] = useState<AppointmentInput>({
        clinicId: "", doctorId: "", patientId: "", startsAt: "", status: "SCHEDULED",
    });
    const isEdit = Boolean(initialData?.id);

    // 🔧 SINCRONIZAÇÃO
    useEffect(() => {
        if (initialData) {
            setForm({
                clinicId: initialData.clinicId ?? "",
                doctorId: initialData.doctorId ?? "",
                patientId: initialData.patientId ?? "",
                startsAt: initialData.startsAt ?? "",
                status: initialData.status ?? "SCHEDULED",
            });
        } else {
            setForm({ clinicId: "", doctorId: "", patientId: "", startsAt: "", status: "SCHEDULED" });
        }
    }, [initialData]);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [showSuccess, setShowSuccess] = useState(false);
    const [createdInfo, setCreatedInfo] = useState<{ clinic?: string; doctor?: string; patient?: string; when?: string } | null>(null);

    const clinicName = useMemo(() => clinics.find(c => c.id === form.clinicId)?.name, [clinics, form.clinicId]);
    const doctorName = useMemo(() => doctors.find(d => d.id === form.doctorId)?.name, [doctors, form.doctorId]);
    const patientName = useMemo(() => patients.find(p => p.id === form.patientId)?.name, [patients, form.patientId]);

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
            patientId: form.patientId,
            startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : undefined,
            status: form.status, // opcional
        };

        // Validação opcional:
        // const parsed = appointmentSchema.safeParse(payload);
        // if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Verifique os campos."); return; }

        setSubmitting(true);
        try {
            const res = await fetch(isEdit ? `/api/appointments/${initialData!.id}` : "/api/appointments", {
                method: isEdit ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload), // ou parsed.data
            });
            if (!res.ok) {
                const txt = await res.text().catch(() => "");
                let msg = txt; try { msg = JSON.parse(txt)?.error ?? txt; } catch { }
                throw new Error(msg || `Erro ao ${isEdit ? "atualizar" : "criar"} consulta`);
            }

            setCreatedInfo({
                clinic: clinicName,
                doctor: doctorName,
                patient: patientName,
                when: form.startsAt ? new Date(form.startsAt).toLocaleString() : undefined,
            });
            setShowSuccess(true);

            if (!isEdit) setForm({ clinicId: "", doctorId: "", patientId: "", startsAt: "", status: "SCHEDULED" });
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
                        <option value="">Selecione</option>
                        {clinics.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                <div className="grid gap-1">
                    <label className="text-sm">Médico</label>
                    <select name="doctorId" value={form.doctorId} onChange={onChange} className="rounded border px-3 py-2" required>
                        <option value="">Selecione</option>
                        {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>

                <div className="grid gap-1">
                    <label className="text-sm">Paciente</label>
                    <select name="patientId" value={form.patientId} onChange={onChange} className="rounded border px-3 py-2" required>
                        <option value="">Selecione</option>
                        {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>

                <div className="grid gap-1">
                    <label className="text-sm">Início</label>
                    <input
                        type="datetime-local"
                        name="startsAt"
                        value={form.startsAt}
                        onChange={onChange}
                        className="rounded border px-3 py-2"
                        required
                    />
                </div>

                {/* Se quiser controlar status no form, mantenha; senão remova */}
                {/* <div className="grid gap-1">
          <label className="text-sm">Status</label>
          <input
            name="status"
            value={form.status ?? ""}
            onChange={onChange}
            className="rounded border px-3 py-2"
          />
        </div> */}

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
                            {isEdit ? "Consulta atualizada!" : "Consulta agendada!"}
                        </h2>
                        {(createdInfo?.when || createdInfo?.clinic || createdInfo?.doctor || createdInfo?.patient) && (
                            <p className="mt-1 text-sm text-gray-600">
                                {createdInfo?.when && <span className="font-medium">{createdInfo.when}</span>}
                                {(createdInfo?.when && (createdInfo?.clinic || createdInfo?.doctor || createdInfo?.patient)) && " • "}
                                {createdInfo?.clinic && <span className="font-medium">{createdInfo.clinic}</span>}
                                {(createdInfo?.clinic && createdInfo?.doctor) && " • "}
                                {createdInfo?.doctor && <span className="font-medium">{createdInfo.doctor}</span>}
                                {(createdInfo?.doctor && createdInfo?.patient) && " • "}
                                {createdInfo?.patient && <span className="font-medium">{createdInfo.patient}</span>}
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
