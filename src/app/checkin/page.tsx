"use client";
import { useState } from "react";

export default function CheckinCodePage() {
  const [code,setCode] = useState("");
  const [msg,setMsg] = useState<string>();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/checkin", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ code })
    });
    setMsg(res.ok ? "Check-in confirmado!" : "Código inválido.");
  }

  return (
    <div className="mx-auto max-w-sm rounded border bg-white p-6">
      <h1 className="mb-3 text-lg font-semibold">Check-in</h1>
      <form onSubmit={submit} className="space-y-3">
        <input value={code} onChange={e=>setCode(e.target.value)} className="w-full rounded border px-3 py-2" placeholder="Digite o código de 6 dígitos" />
        <button className="w-full rounded bg-emerald-600 px-3 py-2 text-white">Confirmar</button>
      </form>
      {msg && <p className="mt-3 text-center text-sm">{msg}</p>}
    </div>
  );
}
