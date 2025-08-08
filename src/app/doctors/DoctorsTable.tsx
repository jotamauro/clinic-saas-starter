"use client";

import { useMemo, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

type Row = {
    id: string;
    name: string;
    crm: string;
    specialty: string;
    email: string | null;
    phone: string | null;
    clinicId: string | null;
    clinicName: string | null;
};

const norm = (s: unknown) =>
    (s ?? "").toString().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
const inc = (needle: string, hay: unknown) => norm(hay).includes(norm(needle));

export function DoctorsTable({
    data,
    onEdit,
}: {
    data: Row[];
    onEdit: (row: Row) => void;
}) {
    const [qName, setQName] = useState("");
    const [qCrm, setQCrm] = useState("");
    const [qSpec, setQSpec] = useState("");
    const [qClinic, setQClinic] = useState("");

    const filtered = useMemo(
        () =>
            data.filter(
                (d) =>
                    inc(qName, d.name) &&
                    inc(qCrm, d.crm) &&
                    inc(qSpec, d.specialty) &&
                    inc(qClinic, d.clinicName)
            ),
        [data, qName, qCrm, qSpec, qClinic]
    );

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
                <thead className="bg-gray-100 text-left">
                    <tr className="border-b">
                        <th className="px-3 py-2">Nome</th>
                        <th className="px-3 py-2">CRM</th>
                        <th className="px-3 py-2">Especialidade</th>
                        <th className="px-3 py-2">Clínica</th>
                        <th className="px-3 py-2 w-16">Ações</th>
                    </tr>
                    <tr className="border-b bg-white">
                        <th className="px-3 py-2">
                            <input className="w-full rounded border px-2 py-1" placeholder="Filtrar nome…" value={qName} onChange={(e) => setQName(e.target.value)} />
                        </th>
                        <th className="px-3 py-2">
                            <input className="w-full rounded border px-2 py-1" placeholder="Filtrar CRM…" value={qCrm} onChange={(e) => setQCrm(e.target.value)} />
                        </th>
                        <th className="px-3 py-2">
                            <input className="w-full rounded border px-2 py-1" placeholder="Filtrar especialidade…" value={qSpec} onChange={(e) => setQSpec(e.target.value)} />
                        </th>
                        <th className="px-3 py-2">
                            <input className="w-full rounded border px-2 py-1" placeholder="Filtrar clínica…" value={qClinic} onChange={(e) => setQClinic(e.target.value)} />
                        </th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {filtered.length === 0 ? (
                        <tr>
                            <td className="px-3 py-3 text-gray-500" colSpan={5}>Nenhum resultado.</td>
                        </tr>
                    ) : (
                        filtered.map((d) => (
                            <tr key={d.id} className="border-b">
                                <td className="px-3 py-2">{d.name}</td>
                                <td className="px-3 py-2">{d.crm}</td>
                                <td className="px-3 py-2">{d.specialty}</td>
                                <td className="px-3 py-2">{d.clinicName ?? "-"}</td>
                                <td className="px-3 py-2">
                                    <button
                                        onClick={() => onEdit(d)}
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
