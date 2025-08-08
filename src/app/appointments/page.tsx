import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/Card";
import { AppointmentsManager } from "./AppointmentsManager";

export default async function AppointmentsPage() {
  const [appts, clinics, doctors, patients] = await Promise.all([
    prisma.appointment.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        startsAt: true,
        status: true,
        clinic: { select: { id: true, name: true } },
        doctor: { select: { id: true, name: true } },
        patient: { select: { id: true, name: true } },
      },
    }),
    prisma.clinic.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.doctor.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.patient.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  const rows = appts.map(a => ({
    id: a.id,
    clinicId: a.clinic?.id ?? "",
    clinicName: a.clinic?.name ?? "",
    doctorId: a.doctor?.id ?? "",
    doctorName: a.doctor?.name ?? "",
    patientId: a.patient?.id ?? "",
    patientName: a.patient?.name ?? "",
    startsAtISO: a.startsAt?.toISOString() ?? "",
    status: a.status,
  }));

  return (
    <div className="grid gap-6">
      <Card>
        <CardTitle>Consultas</CardTitle>
        <AppointmentsManager
          initialAppointments={rows}
          clinics={clinics}
          doctors={doctors}
          patients={patients}
        />
      </Card>
    </div>
  );
}
