"use client";

import { useMemo, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline"; // npm i @heroicons/react

type ClinicRow = {
    id: string;
    name: string;
    document: string | null;
    phone: string | null;
    address: string | null;
};

export function ClinicsTable({
    data,
    onEdit,
}: {
    data: ClinicRow[];
    onEdit: (row: ClinicRow) => void;
}) {
    const [qName, setQName] = useState("");
    const [qDoc, setQDoc] = useState("");
    const [qPhone, setQPhone] = useState("");
    const [qAddr, setQAddr] = useState("");

    const norm = (s: unknown) => (s ?? "").toString().toLowerCase();
    const by = (needle: string, hay: unknown) =>
        norm(hay).includes(needle.trim().toLowerCase());

    const filtered = useMemo(
        () =>
            data.filter(
                (c) =>
                    by(qName, c.name) &&
                    by(qDoc, c.document) &&
                    by(qPhone, c.phone) &&
                    by(qAddr, c.address)
            ),
        [data, qName, qDoc, qPhone, qAddr]
    );

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
                <thead className="bg-gray-100 text-left">
                    <tr className="border-b">
                        <th className="px-3 py-2">Nome</th>
                        <th className="px-3 py-2">CNPJ</th>
                        <th className="px-3 py-2">Telefone</th>
                        <th className="px-3 py-2">Endereço</th>
                        <th className="px-3 py-2 w-16">Ações</th>
                    </tr>
                    <tr className="border-b bg-white">
                        <th className="px-3 py-2">
                            <input className="w-full rounded border px-2 py-1" placeholder="Filtrar nome…" value={qName} onChange={(e) => setQName(e.target.value)} />
                        </th>
                        <th className="px-3 py-2">
                            <input className="w-full rounded border px-2 py-1" placeholder="Filtrar CNPJ…" value={qDoc} onChange={(e) => setQDoc(e.target.value)} />
                        </th>
                        <th className="px-3 py-2">
                            <input className="w-full rounded border px-2 py-1" placeholder="Filtrar telefone…" value={qPhone} onChange={(e) => setQPhone(e.target.value)} />
                        </th>
                        <th className="px-3 py-2">
                            <input className="w-full rounded border px-2 py-1" placeholder="Filtrar endereço…" value={qAddr} onChange={(e) => setQAddr(e.target.value)} />
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
                        filtered.map((c) => (
                            <tr key={c.id} className="border-b">
                                <td className="px-3 py-2">{c.name}</td>
                                <td className="px-3 py-2">{c.document ?? "-"}</td>
                                <td className="px-3 py-2">{c.phone ?? "-"}</td>
                                <td className="px-3 py-2">{c.address ?? "-"}</td>
                                <td className="px-3 py-2">
                                    <button
                                        onClick={() => onEdit(c)}
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
