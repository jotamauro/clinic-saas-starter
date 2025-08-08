// src/app/schedule/SlotsTable.tsx
"use client";

import { useMemo, useState } from "react";

type Row = {
    id: string;
    doctorId: string;
    doctorName: string;
    weekday: number;      // 0..6
    startTime: string;    // "HH:mm"
    endTime: string;      // "HH:mm"
    durationMin: number;
};

const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const norm = (v: unknown) =>
    (v ?? "")
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");

const inc = (needle: string, hay: unknown) =>
    norm(hay).includes(norm(needle));

export function SlotsTable({ data }: { data: Row[] }) {
    const [qDoctor, setQDoctor] = useState("");
    const [qDay, setQDay] = useState("");
    const [qWindow, setQWindow] = useState("");  // filtra por hora "08", "08:30", "08-12"
    const [qDur, setQDur] = useState("");        // filtra por 30, 45 etc.

    const filtered = useMemo(() => {
        return data.filter((r) => {
            const windowStr = `${r.startTime}-${r.endTime}`;
            const dayStr = weekdays[r.weekday] ?? String(r.weekday);
            const okDoctor = inc(qDoctor, r.doctorName);
            const okDay = qDay.trim() === "" || inc(qDay, dayStr);
            const okWin = qWindow.trim() === "" || inc(qWindow, windowStr) || inc(qWindow, r.startTime) || inc(qWindow, r.endTime);
            const okDur = qDur.trim() === "" || norm(r.durationMin).includes(norm(qDur));
            return okDoctor && okDay && okWin && okDur;
        });
    }, [data, qDoctor, qDay, qWindow, qDur]);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
                <thead className="bg-gray-100 text-left">
                    <tr className="border-b">
                        <th className="px-3 py-2">Médico</th>
                        <th className="px-3 py-2">Dia</th>
                        <th className="px-3 py-2">Janela</th>
                        <th className="px-3 py-2">Duração</th>
                    </tr>
                    <tr className="border-b bg-white">
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
                                placeholder='Filtrar dia… (ex: "seg")'
                                value={qDay}
                                onChange={(e) => setQDay(e.target.value)}
                                className="w-full rounded border px-2 py-1"
                            />
                        </th>
                        <th className="px-3 py-2">
                            <input
                                placeholder='Filtrar janela… (ex: "08", "08:30", "08-12")'
                                value={qWindow}
                                onChange={(e) => setQWindow(e.target.value)}
                                className="w-full rounded border px-2 py-1"
                            />
                        </th>
                        <th className="px-3 py-2">
                            <input
                                placeholder="Filtrar duração… (min)"
                                value={qDur}
                                onChange={(e) => setQDur(e.target.value)}
                                className="w-full rounded border px-2 py-1"
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.length === 0 ? (
                        <tr>
                            <td className="px-3 py-3 text-gray-500" colSpan={4}>
                                Nenhum resultado para os filtros atuais.
                            </td>
                        </tr>
                    ) : (
                        filtered.map((r) => (
                            <tr key={r.id} className="border-b">
                                <td className="px-3 py-2">{r.doctorName || "-"}</td>
                                <td className="px-3 py-2">{weekdays[r.weekday] ?? r.weekday}</td>
                                <td className="px-3 py-2">{r.startTime}–{r.endTime}</td>
                                <td className="px-3 py-2">{r.durationMin} min</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
