"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
// opcional: valide no client se quiser evitar 400
// import { appointmentSchema } from "@/schemas";
import { CheckCircleIcon } from "@heroicons/react/24/solid"; // npm i @heroicons/react

type Opt = { id: string; name: string };

export function NewAppointmentForm({
    clinics, doctors, patients,
}: { clinics: Opt[]; doctors: Opt[]; patients: Opt[] }) {
    const router = useRouter();

    const [formKey, setFormKey] = useState(0); // força reset do form
    const [form, setForm] = useState({
        clinicId: "",
        doctorId: "",
        patientId: "",
        startsAt: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Modal de sucesso
    const [showSuccess, setShowSuccess] = useState(false);
    const [createdInfo, setCreatedInfo] = useState<{
        clinic?: string; doctor?: string; patient?: string; when?: string;
    } | null>(null);

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
        };

        // opcional: validação com Zod
        // const parsed = appointmentSchema.safeParse(payload);
        // if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Verifique os campos."); return; }

        setSubmitting(true);
        try {
            const res = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload), // ou JSON.stringify(parsed.data)
            });
            if (!res.ok) {
                const txt = await res.text().catch(() => "");
                let msg = txt;
                try { msg = JSON.parse(txt)?.error ?? txt; } catch { }
                throw new Error(msg || `Erro ao criar consulta: ${res.status}`);
            }

            // sucesso -> modal + reset
            setCreatedInfo({
                clinic: clinicName,
                doctor: doctorName,
                patient: patientName,
                when: form.startsAt ? new Date(form.startsAt).toLocaleString() : undefined,
            });
            setShowSuccess(true);
            setFormKey(k => k + 1);
            setForm({ clinicId: "", doctorId: "", patientId: "", startsAt: "" });
        } catch (err: any) {
            setError(err?.message ?? "Erro ao salvar.");
        } finally {
            setSubmitting(false);
        }
    }

    function closeAndRefresh() {
        setShowSuccess(false);
        router.refresh(); // atualiza a lista de consultas
    }

    return (
        <>
            <form key={formKey} onSubmit={onSubmit} className="grid gap-3">
                <div className="grid gap-1">
                    <label className="text-sm">Clínica</label>
                    <select
                        name="clinicId"
                        value={form.clinicId}
                        onChange={onChange}
                        className="rounded border px-3 py-2"
                        required
                    >
                        <option value="">Selecione</option>
                        {clinics.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                <div className="grid gap-1">
                    <label className="text-sm">Médico</label>
                    <select
                        name="doctorId"
                        value={form.doctorId}
                        onChange={onChange}
                        className="rounded border px-3 py-2"
                        required
                    >
                        <option value="">Selecione</option>
                        {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>

                <div className="grid gap-1">
                    <label className="text-sm">Paciente</label>
                    <select
                        name="patientId"
                        value={form.patientId}
                        onChange={onChange}
                        className="rounded border px-3 py-2"
                        required
                    >
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

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                    disabled={submitting}
                    className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-50"
                >
                    {submitting ? "Salvando..." : "Agendar"}
                </button>
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
                            Consulta agendada com sucesso!
                        </h2>
                        {(createdInfo?.clinic || createdInfo?.doctor || createdInfo?.patient || createdInfo?.when) && (
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
