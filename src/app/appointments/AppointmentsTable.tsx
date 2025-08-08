"use client";

import { useMemo, useState } from "react";

type Row = {
    id: string;
    startsAt: string | Date;
    status: string;
    clinicName: string;
    doctorName: string;
    patientName: string;
};

const norm = (v: unknown) =>
    (v ?? "")
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");

const inc = (needle: string, hay: unknown) => norm(hay).includes(norm(needle));

export function AppointmentsTable({ data }: { data: Row[] }) {
    const [qDate, setQDate] = useState("");     // aceita "2025-08", "10/08", "14:00", etc.
    const [qClinic, setQClinic] = useState("");
    const [qDoctor, setQDoctor] = useState("");
    const [qPatient, setQPatient] = useState("");
    const [qStatus, setQStatus] = useState("");

    const filtered = useMemo(() => {
        return data.filter(r => {
            const dateStr = new Date(r.startsAt).toLocaleString();
            return (
                (qDate.trim() === "" || inc(qDate, dateStr)) &&
                (qClinic.trim() === "" || inc(qClinic, r.clinicName)) &&
                (qDoctor.trim() === "" || inc(qDoctor, r.doctorName)) &&
                (qPatient.trim() === "" || inc(qPatient, r.patientName)) &&
                (qStatus.trim() === "" || inc(qStatus, r.status))
            );
        });
    }, [data, qDate, qClinic, qDoctor, qPatient, qStatus]);

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
                    </tr>
                    <tr className="border-b bg-white">
                        <th className="px-3 py-2">
                            <input
                                placeholder='Filtrar data… (ex: "2025-08", "10/08", "14:00")'
                                value={qDate}
                                onChange={(e) => setQDate(e.target.value)}
                                className="w-full rounded border px-2 py-1"
                            />
                        </th>
                        <th className="px-3 py-2">
                            <input
                                placeholder="Filtrar clínica…"
                                value={qClinic}
                                onChange={(e) => setQClinic(e.target.value)}
                                className="w-full rounded border px-2 py-1"
                            />
                        </th>
                        <th className="px-3 py-2">
                            <input
                                placeholder="Filtrar médico…"
                                value={qDoctor}
                                onChange={(e) => setQDoctor(e.target.value)}
                                className="w-full rounded border px-2 py-1"
                            />
                        </th>
                        <th className="px-3 py-2">
                            <input
                                placeholder="Filtrar paciente…"
                                value={qPatient}
                                onChange={(e) => setQPatient(e.target.value)}
                                className="w-full rounded border px-2 py-1"
                            />
                        </th>
                        <th className="px-3 py-2">
                            <input
                                placeholder='Filtrar status… (ex: "AGENDADA")'
                                value={qStatus}
                                onChange={(e) => setQStatus(e.target.value)}
                                className="w-full rounded border px-2 py-1"
                            />
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {filtered.length === 0 ? (
                        <tr>
                            <td className="px-3 py-3 text-gray-500" colSpan={5}>
                                Nenhum resultado para os filtros atuais.
                            </td>
                        </tr>
                    ) : (
                        filtered.map((r) => (
                            <tr key={r.id} className="border-b">
                                <td className="px-3 py-2">{new Date(r.startsAt).toLocaleString()}</td>
                                <td className="px-3 py-2">{r.clinicName || "-"}</td>
                                <td className="px-3 py-2">{r.doctorName || "-"}</td>
                                <td className="px-3 py-2">{r.patientName || "-"}</td>
                                <td className="px-3 py-2">{r.status}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
