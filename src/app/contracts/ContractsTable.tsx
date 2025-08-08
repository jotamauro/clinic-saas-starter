"use client";

import { useMemo, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

type Row = {
    id: string;
    clinicId: string;
    clinicName: string;
    doctorId: string;
    doctorName: string;
    startDate: string; // ISO
    endDate: string;   // ISO | ""
    revenueShare: number;
    isActive: boolean;
};

const norm = (s: unknown) =>
    (s ?? "").toString().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
const inc = (needle: string, hay: unknown) => norm(hay).includes(norm(needle));

export function ContractsTable({ data, onEdit }: {
    data: Row[]; onEdit: (row: Row) => void;
}) {
    const [qClinic, setQClinic] = useState("");
    const [qDoctor, setQDoctor] = useState("");
    const [qStart, setQStart] = useState("");
    const [qEnd, setQEnd] = useState("");
    const [qShare, setQShare] = useState("");
    const [qActive, setQActive] = useState("");

    const filtered = useMemo(() => {
        return data.filter(r => {
            const startStr = new Date(r.startDate).toLocaleString();
            const endStr = r.endDate ? new Date(r.endDate).toLocaleString() : "";
            const shareStr = `${Math.round(r.revenueShare * 100)}%`;
            const activeStr = r.isActive ? "sim" : "não";
            return (
                (qClinic === "" || inc(qClinic, r.clinicName)) &&
                (qDoctor === "" || inc(qDoctor, r.doctorName)) &&
                (qStart === "" || inc(qStart, startStr)) &&
                (qEnd === "" || inc(qEnd, endStr)) &&
                (qShare === "" || inc(qShare, shareStr)) &&
                (qActive === "" || inc(qActive, activeStr))
            );
        });
    }, [data, qClinic, qDoctor, qStart, qEnd, qShare, qActive]);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
                <thead className="bg-gray-100 text-left">
                    <tr className="border-b">
                        <th className="px-3 py-2">Clínica</th>
                        <th className="px-3 py-2">Médico</th>
                        <th className="px-3 py-2">Início</th>
                        <th className="px-3 py-2">Fim</th>
                        <th className="px-3 py-2">Repasse</th>
                        <th className="px-3 py-2">Ativo</th>
                        <th className="px-3 py-2 w-16">Ações</th>
                    </tr>
                    <tr className="border-b bg-white">
                        <th className="px-3 py-2"><input className="w-full rounded border px-2 py-1" placeholder="Filtrar clínica…" value={qClinic} onChange={e => setQClinic(e.target.value)} /></th>
                        <th className="px-3 py-2"><input className="w-full rounded border px-2 py-1" placeholder="Filtrar médico…" value={qDoctor} onChange={e => setQDoctor(e.target.value)} /></th>
                        <th className="px-3 py-2"><input className="w-full rounded border px-2 py-1" placeholder='Filtrar início… (ex: "2025-08")' value={qStart} onChange={e => setQStart(e.target.value)} /></th>
                        <th className="px-3 py-2"><input className="w-full rounded border px-2 py-1" placeholder="Filtrar fim…" value={qEnd} onChange={e => setQEnd(e.target.value)} /></th>
                        <th className="px-3 py-2"><input className="w-full rounded border px-2 py-1" placeholder='Filtrar repasse… (ex: "60%")' value={qShare} onChange={e => setQShare(e.target.value)} /></th>
                        <th className="px-3 py-2"><input className="w-full rounded border px-2 py-1" placeholder='Filtrar ativo… ("sim" ou "não")' value={qActive} onChange={e => setQActive(e.target.value)} /></th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {filtered.length === 0 ? (
                        <tr><td colSpan={7} className="px-3 py-3 text-gray-500">Nenhum resultado.</td></tr>
                    ) : (
                        filtered.map(r => (
                            <tr key={r.id} className="border-b">
                                <td className="px-3 py-2">{r.clinicName}</td>
                                <td className="px-3 py-2">{r.doctorName}</td>
                                <td className="px-3 py-2">{new Date(r.startDate).toLocaleString()}</td>
                                <td className="px-3 py-2">{r.endDate ? new Date(r.endDate).toLocaleString() : "-"}</td>
                                <td className="px-3 py-2">{Math.round(r.revenueShare * 100)}%</td>
                                <td className="px-3 py-2">{r.isActive ? "Sim" : "Não"}</td>
                                <td className="px-3 py-2">
                                    <button
                                        onClick={() => onEdit(r)}
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
