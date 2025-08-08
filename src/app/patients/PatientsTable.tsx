"use client";

import { useMemo, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline"; // npm i @heroicons/react

type PatientRow = {
    id: string;
    name: string;
    document: string | null;
    email: string | null;
    phone: string | null;
};

const norm = (s: unknown) =>
    (s ?? "").toString().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
const inc = (needle: string, hay: unknown) => norm(hay).includes(norm(needle));

export function PatientsTable({
    data,
    onEdit,
}: {
    data: PatientRow[];
    onEdit: (row: PatientRow) => void;
}) {
    const [qName, setQName] = useState("");
    const [qDoc, setQDoc] = useState("");
    const [qEmail, setQEmail] = useState("");
    const [qPhone, setQPhone] = useState("");

    const filtered = useMemo(
        () =>
            data.filter(
                (p) =>
                    inc(qName, p.name) &&
                    inc(qDoc, p.document) &&
                    inc(qEmail, p.email) &&
                    inc(qPhone, p.phone)
            ),
        [data, qName, qDoc, qEmail, qPhone]
    );

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
                <thead className="bg-gray-100 text-left">
                    <tr className="border-b">
                        <th className="px-3 py-2">Nome</th>
                        <th className="px-3 py-2">Documento</th>
                        <th className="px-3 py-2">Email</th>
                        <th className="px-3 py-2">Telefone</th>
                        <th className="px-3 py-2 w-16">Ações</th>
                    </tr>
                    <tr className="border-b bg-white">
                        <th className="px-3 py-2">
                            <input className="w-full rounded border px-2 py-1" placeholder="Filtrar nome…" value={qName} onChange={(e) => setQName(e.target.value)} />
                        </th>
                        <th className="px-3 py-2">
                            <input className="w-full rounded border px-2 py-1" placeholder="Filtrar documento…" value={qDoc} onChange={(e) => setQDoc(e.target.value)} />
                        </th>
                        <th className="px-3 py-2">
                            <input className="w-full rounded border px-2 py-1" placeholder="Filtrar email…" value={qEmail} onChange={(e) => setQEmail(e.target.value)} />
                        </th>
                        <th className="px-3 py-2">
                            <input className="w-full rounded border px-2 py-1" placeholder="Filtrar telefone…" value={qPhone} onChange={(e) => setQPhone(e.target.value)} />
                        </th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {filtered.length === 0 ? (
                        <tr>
                            <td className="px-3 py-3 text-gray-500" colSpan={5}>Nenhum resultado para os filtros atuais.</td>
                        </tr>
                    ) : (
                        filtered.map((p) => (
                            <tr key={p.id} className="border-b">
                                <td className="px-3 py-2">{p.name}</td>
                                <td className="px-3 py-2">{p.document ?? "-"}</td>
                                <td className="px-3 py-2">{p.email ?? "-"}</td>
                                <td className="px-3 py-2">{p.phone ?? "-"}</td>
                                <td className="px-3 py-2">
                                    <button
                                        onClick={() => onEdit(p)}
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
