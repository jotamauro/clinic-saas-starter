import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/Card";
import { NewAppointmentForm } from "./NewAppointmentForm";
import { AppointmentsTable } from "./AppointmentsTable";

export default async function AppointmentsPage() {
  const [clinics, doctors, patients, appts] = await Promise.all([
    prisma.clinic.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.doctor.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.patient.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.appointment.findMany({
      orderBy: { startsAt: "desc" },
      select: {
        id: true,
        startsAt: true,
        status: true,
        clinic: { select: { id: true, name: true } },
        doctor: { select: { id: true, name: true } },
        patient: { select: { id: true, name: true } },
      },
    }),
  ]);

  const rows = appts.map(a => ({
    id: a.id,
    startsAt: a.startsAt,
    status: a.status as string,
    clinicName: a.clinic?.name ?? "",
    doctorName: a.doctor?.name ?? "",
    patientName: a.patient?.name ?? "",
  }));

  return (
    <div className="grid gap-6">
      <Card>
        <CardTitle>Nova Consulta</CardTitle>
        <NewAppointmentForm clinics={clinics} doctors={doctors} patients={patients} />
      </Card>

      <Card>
        <CardTitle>Consultas</CardTitle>
        <AppointmentsTable data={rows} />
      </Card>
    </div>
  );
}
