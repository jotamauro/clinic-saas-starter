import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/Card";
import { SlotsManager } from "./SlotsManager";

export default async function SchedulePage() {
  const [slots, doctors] = await Promise.all([
    prisma.slot.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        weekday: true,
        startTime: true,
        endTime: true,
        durationMin: true,
        doctor: { select: { id: true, name: true } },
      },
    }),
    prisma.doctor.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  const rows = slots.map(s => ({
    id: s.id,
    doctorId: s.doctor?.id ?? "",
    doctorName: s.doctor?.name ?? "",
    weekday: s.weekday,            // number 0..6
    startTime: s.startTime,        // "HH:mm"
    endTime: s.endTime,            // "HH:mm"
    durationMin: s.durationMin,    // number
  }));

  return (
    <div className="grid gap-6">
      <Card>
        <CardTitle>Agenda</CardTitle>
        <SlotsManager initialSlots={rows} doctors={doctors} />
      </Card>
    </div>
  );
}
