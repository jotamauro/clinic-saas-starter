"use client";

import { useMemo, useState } from "react";

type Row = {
    id: string;
    clinicName: string;
    doctorName: string;
    startDate: string | Date;
    endDate: string | Date | null;
    revenueShare: number; // 0..1
    isActive: boolean;
};

const norm = (v: unknown) =>
    (v ?? "")
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");

const inc = (needle: string, hay: unknown) =>
    norm(hay).includes(norm(needle));

export function ContractsTable({ data }: { data: Row[] }) {
    const [qClinic, setQClinic] = useState("");
    const [qDoctor, setQDoctor] = useState("");
    const [qStart, setQStart] = useState(""); // texto livre (YYYY-MM, dd/mm, etc.)
    const [qShare, setQShare] = useState(""); // ex: "60" ou "0.6"
    const [qActive, setQActive] = useState(""); // "sim"/"nao"

    const filtered = useMemo(() => {
        return data.filter((r) => {
            const startStr = new Date(r.startDate).toLocaleString();
            const sharePct = Math.round(r.revenueShare * 100).toString();
            const activeStr = r.isActive ? "sim" : "nao";

            const okClinic = inc(qClinic, r.clinicName);
            const okDoctor = inc(qDoctor, r.doctorName);
            const okStart = inc(qStart, startStr);
            // aceita "60", "60%", "0.6"
            const okShare =
                qShare.trim() === "" ||
                inc(qShare.replace("%", ""), sharePct) ||
                inc(qShare, r.revenueShare);

            const okActive =
                qActive.trim() === "" ||
                inc(qActive, activeStr);

            return okClinic && okDoctor && okStart && okShare && okActive;
        });
    }, [data, qClinic, qDoctor, qStart, qShare, qActive]);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
                <thead className="bg-gray-100 text-left">
                    <tr className="border-b">
                        <th className="px-3 py-2">Clínica</th>
                        <th className="px-3 py-2">Médico</th>
                        <th className="px-3 py-2">Início</th>
                        <th className="px-3 py-2">Repasse</th>
                        <th className="px-3 py-2">Ativo</th>
                    </tr>
                    <tr className="border-b bg-white">
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
                                placeholder="Filtrar data início…"
                                value={qStart}
                                onChange={(e) => setQStart(e.target.value)}
                                className="w-full rounded border px-2 py-1"
                            />
                        </th>
                        <th className="px-3 py-2">
                            <input
                                placeholder="Filtrar repasse… (ex: 60, 60%, 0.6)"
                                value={qShare}
                                onChange={(e) => setQShare(e.target.value)}
                                className="w-full rounded border px-2 py-1"
                            />
                        </th>
                        <th className="px-3 py-2">
                            <input
                                placeholder='Filtrar ativo… ("sim"/"nao")'
                                value={qActive}
                                onChange={(e) => setQActive(e.target.value)}
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
                                <td className="px-3 py-2">{r.clinicName || "-"}</td>
                                <td className="px-3 py-2">{r.doctorName || "-"}</td>
                                <td className="px-3 py-2">
                                    {new Date(r.startDate).toLocaleString()}
                                </td>
                                <td className="px-3 py-2">{Math.round(r.revenueShare * 100)}%</td>
                                <td className="px-3 py-2">{r.isActive ? "Sim" : "Não"}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
