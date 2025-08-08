// src/app/schedule/page.tsx
import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/Card";
import { NewSlotForm } from "./NewSlotForm";
import { SlotsTable } from "./SlotsTable";

export default async function SchedulePage() {
  const [slots, doctors] = await Promise.all([
    prisma.slot.findMany({
      orderBy: [{ weekday: "asc" }, { startTime: "asc" }],
      select: {
        id: true,
        weekday: true,
        startTime: true,
        endTime: true,
        durationMin: true,
        doctor: { select: { id: true, name: true } },
      },
    }),
    prisma.doctor.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const rows = slots.map((s) => ({
    id: s.id,
    doctorId: s.doctor?.id ?? "",
    doctorName: s.doctor?.name ?? "",
    weekday: s.weekday,            // 0..6
    startTime: s.startTime,        // "HH:mm"
    endTime: s.endTime,            // "HH:mm"
    durationMin: s.durationMin,    // number
  }));

  return (
    <div className="grid gap-6">
      {/* Formulário em cima */}
      <Card>
        <CardTitle>Novo Slot (Disponibilidade)</CardTitle>
        <NewSlotForm doctors={doctors} />
      </Card>

      {/* Lista embaixo com filtros */}
      <Card>
        <CardTitle>Agenda Base</CardTitle>
        <SlotsTable data={rows} />
      </Card>
    </div>
  );
}
