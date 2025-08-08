"use client";
import { useEffect, useState } from "react";

export default function CheckinPage({ params }: { params: { token: string }}) {
  const [status, setStatus] = useState<"loading"|"ok"|"fail">("loading");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ token: params.token })
      });
      setStatus(res.ok ? "ok" : "fail");
    })();
  }, [params.token]);

  return (
    <div className="mx-auto max-w-md rounded border bg-white p-6 text-center">
      {status === "loading" && <p>Confirmando sua presença…</p>}
      {status === "ok" && <h1 className="text-xl font-semibold text-green-600">Check-in confirmado!</h1>}
      {status === "fail" && <h1 className="text-xl font-semibold text-red-600">Link inválido ou expirado.</h1>}
    </div>
  );
}
