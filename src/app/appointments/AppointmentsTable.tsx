"use client";

import { useMemo, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

type Row = {
    id: string;
    clinicId: string; clinicName: string;
    doctorId: string; doctorName: string;
    patientId: string; patientName: string;
    startsAtISO: string;
    status: string;
};

const norm = (s: unknown) =>
    (s ?? "").toString().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
const inc = (needle: string, hay: unknown) => norm(hay).includes(norm(needle));

export function AppointmentsTable({ data, onEdit }: {
    data: Row[];
    onEdit: (row: Row) => void;
}) {
    const [qClinic, setQClinic] = useState("");
    const [qDoctor, setQDoctor] = useState("");
    const [qPatient, setQPatient] = useState("");
    const [qWhen, setQWhen] = useState("");
    const [qStatus, setQStatus] = useState("");

    const filtered = useMemo(() => {
        return data.filter(a => {
            const when = a.startsAtISO ? new Date(a.startsAtISO).toLocaleString() : "";
            return (
                (qClinic === "" || inc(qClinic, a.clinicName)) &&
                (qDoctor === "" || inc(qDoctor, a.doctorName)) &&
                (qPatient === "" || inc(qPatient, a.patientName)) &&
                (qWhen === "" || inc(qWhen, when)) &&
                (qStatus === "" || inc(qStatus, a.status))
            );
        });
    }, [data, qClinic, qDoctor, qPatient, qWhen, qStatus]);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
                <thead className="bg-gray-100 text-left">
                    <tr className="border-b">
                        <th className="px-3 py-2">Data</th>
                        <th className="px-3 py-2">Clínica</th>
                        <th className="px-3 py-2">Médico</th>
                        <th className="px-3 py-2">Paciente</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2 w-16">Ações</th>
                    </tr>
                    <tr className="border-b bg-white">
                        <th className="px-3 py-2"><input className="w-full rounded border px-2 py-1" placeholder='Filtrar data… ex: "2025-08"' value={qWhen} onChange={e => setQWhen(e.target.value)} /></th>
                        <th className="px-3 py-2"><input className="w-full rounded border px-2 py-1" placeholder="Filtrar clínica…" value={qClinic} onChange={e => setQClinic(e.target.value)} /></th>
                        <th className="px-3 py-2"><input className="w-full rounded border px-2 py-1" placeholder="Filtrar médico…" value={qDoctor} onChange={e => setQDoctor(e.target.value)} /></th>
                        <th className="px-3 py-2"><input className="w-full rounded border px-2 py-1" placeholder="Filtrar paciente…" value={qPatient} onChange={e => setQPatient(e.target.value)} /></th>
                        <th className="px-3 py-2"><input className="w-full rounded border px-2 py-1" placeholder='Filtrar status… ex: "SCHEDULED"' value={qStatus} onChange={e => setQStatus(e.target.value)} /></th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {filtered.length === 0 ? (
                        <tr><td className="px-3 py-3 text-gray-500" colSpan={6}>Nenhum resultado.</td></tr>
                    ) : (
                        filtered.map(a => (
                            <tr key={a.id} className="border-b">
                                <td className="px-3 py-2">{a.startsAtISO ? new Date(a.startsAtISO).toLocaleString() : "-"}</td>
                                <td className="px-3 py-2">{a.clinicName || "-"}</td>
                                <td className="px-3 py-2">{a.doctorName || "-"}</td>
                                <td className="px-3 py-2">{a.patientName || "-"}</td>
                                <td className="px-3 py-2">{a.status}</td>
                                <td className="px-3 py-2">
                                    <button
                                        onClick={() => onEdit(a)}
                                        title="Editar"
                                        className="inline-flex items-center rounded border px-2 py-1 hover:bg-gray-50"
                                    >
                                        <PencilSquareIcon className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
