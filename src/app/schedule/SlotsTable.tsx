"use client";

import { useMemo, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

type Row = {
    id: string;
    doctorId: string;
    doctorName: string;
    weekday: number;     // 0..6
    startTime: string;   // "HH:mm"
    endTime: string;     // "HH:mm"
    durationMin: number;
};

const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const norm = (s: unknown) => (s ?? "").toString().toLowerCase();

export function SlotsTable({ data, onEdit }: {
    data: Row[]; onEdit: (row: Row) => void;
}) {
    const [qDoc, setQDoc] = useState("");
    const [qDay, setQDay] = useState("");
    const [qWin, setQWin] = useState("");
    const [qDur, setQDur] = useState("");

    const filtered = useMemo(() => {
        return data.filter(r => {
            const dayStr = weekdays[r.weekday] ?? String(r.weekday);
            const winStr = `${r.startTime}-${r.endTime}`;
            const durStr = String(r.durationMin);
            return (
                (qDoc === "" || norm(r.doctorName).includes(norm(qDoc))) &&
                (qDay === "" || norm(dayStr).includes(norm(qDay))) &&
                (qWin === "" || norm(winStr).includes(norm(qWin))) &&
                (qDur === "" || norm(durStr).includes(norm(qDur)))
            );
        });
    }, [data, qDoc, qDay, qWin, qDur]);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
                <thead className="bg-gray-100 text-left">
                    <tr className="border-b">
                        <th className="px-3 py-2">Médico</th>
                        <th className="px-3 py-2">Dia</th>
                        <th className="px-3 py-2">Janela</th>
                        <th className="px-3 py-2">Duração</th>
                        <th className="px-3 py-2 w-16">Ações</th>
                    </tr>
                    <tr className="border-b bg-white">
                        <th className="px-3 py-2"><input className="w-full rounded border px-2 py-1" placeholder="Filtrar médico…" value={qDoc} onChange={e => setQDoc(e.target.value)} /></th>
                        <th className="px-3 py-2"><input className="w-full rounded border px-2 py-1" placeholder='Filtrar dia… ex: "Seg"' value={qDay} onChange={e => setQDay(e.target.value)} /></th>
                        <th className="px-3 py-2"><input className="w-full rounded border px-2 py-1" placeholder='Filtrar janela… "08:00-12:00"' value={qWin} onChange={e => setQWin(e.target.value)} /></th>
                        <th className="px-3 py-2"><input className="w-full rounded border px-2 py-1" placeholder="Filtrar duração…" value={qDur} onChange={e => setQDur(e.target.value)} /></th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {filtered.length === 0 ? (
                        <tr><td colSpan={5} className="px-3 py-3 text-gray-500">Nenhum resultado.</td></tr>
                    ) : (
                        filtered.map(s => (
                            <tr key={s.id} className="border-b">
                                <td className="px-3 py-2">{s.doctorName}</td>
                                <td className="px-3 py-2">{weekdays[s.weekday] ?? s.weekday}</td>
                                <td className="px-3 py-2">{s.startTime}–{s.endTime}</td>
                                <td className="px-3 py-2">{s.durationMin} min</td>
                                <td className="px-3 py-2">
                                    <button
                                        onClick={() => onEdit(s)}
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
