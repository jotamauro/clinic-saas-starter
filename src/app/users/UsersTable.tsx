"use client";

import { useMemo, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

type Row = { id: string; name: string | null; email: string; role: "ADMIN" | "USER" };

const norm = (s: unknown) => (s ?? "").toString().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
const inc = (needle: string, hay: unknown) => norm(hay).includes(norm(needle));

export function UsersTable({ data, onEdit }: { data: Row[]; onEdit: (row: Row) => void }) {
    const [qName, setQName] = useState("");
    const [qEmail, setQEmail] = useState("");
    const [qRole, setQRole] = useState("");

    const filtered = useMemo(
        () => data.filter(u =>
            (qName === "" || inc(qName, u.name)) &&
            (qEmail === "" || inc(qEmail, u.email)) &&
            (qRole === "" || inc(qRole, u.role))
        ),
        [data, qName, qEmail, qRole]
    );

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
                <thead className="bg-gray-100 text-left">
                    <tr className="border-b">
                        <th className="px-3 py-2">Nome</th>
                        <th className="px-3 py-2">Email</th>
                        <th className="px-3 py-2">Role</th>
                        <th className="px-3 py-2 w-16">Ações</th>
                    </tr>
                    <tr className="border-b bg-white">
                        <th className="px-3 py-2"><input className="w-full rounded border px-2 py-1" placeholder="Filtrar nome…" value={qName} onChange={(e) => setQName(e.target.value)} /></th>
                        <th className="px-3 py-2"><input className="w-full rounded border px-2 py-1" placeholder="Filtrar email…" value={qEmail} onChange={(e) => setQEmail(e.target.value)} /></th>
                        <th className="px-3 py-2">
                            <input
                                className="w-full rounded border px-2 py-1"
                                placeholder='Filtrar role… "ADMIN", "MANAGER", "DOCTOR", "RECEPTION"'
                                value={qRole}
                                onChange={(e) => setQRole(e.target.value)}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.length === 0 ? (
                        <tr><td className="px-3 py-3 text-gray-500" colSpan={4}>Nenhum resultado.</td></tr>
                    ) : (
                        filtered.map(u => (
                            <tr key={u.id} className="border-b">
                                <td className="px-3 py-2">{u.name ?? "-"}</td>
                                <td className="px-3 py-2">{u.email}</td>
                                <td className="px-3 py-2">{u.role}</td>
                                <td className="px-3 py-2">
                                    <button
                                        onClick={() => onEdit(u)}
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
