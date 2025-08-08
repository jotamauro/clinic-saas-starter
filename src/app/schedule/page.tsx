// src/app/schedule/page.tsx
import { Card, CardTitle } from "@/components/ui/Card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { headers } from "next/headers";
import { NewSlotForm } from "./NewSlotForm";

async function getJSON(path: string) {
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const cookie = headers().get("cookie") ?? "";
  const res = await fetch(`${base}${path}`, { cache: "no-store", headers: { cookie } });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`GET ${path} -> ${res.status} ${txt}`);
  }
  return res.json();
}

async function getSlots() {
  return getJSON("/api/slots");
}

export default async function SchedulePage() {
  const slots = await getSlots();
  const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardTitle>Novo Slot (Disponibilidade)</CardTitle>
        <NewSlotForm />
      </Card>

      <Card>
        <CardTitle>Agenda Base</CardTitle>
        <Table>
          <THead><TR><TH>Médico</TH><TH>Dia</TH><TH>Janela</TH><TH>Duração</TH></TR></THead>
          <TBody>
            {slots.map((s: any) => (
              <TR key={s.id}>
                <TD title={s.doctor?.id}>{s.doctor?.name ?? "-"}</TD>
                <TD>{weekdays[s.weekday] ?? s.weekday}</TD>
                <TD>{s.startTime}–{s.endTime}</TD>
                <TD>{s.durationMin} min</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
