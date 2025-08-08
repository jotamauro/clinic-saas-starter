import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/Card";
import { DoctorsManager } from "./DoctorsManager";

export default async function DoctorsPage() {
  const [doctors, clinics] = await Promise.all([
    prisma.doctor.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        crm: true,
        specialty: true,
        email: true,
        phone: true,
        clinic: { select: { id: true, name: true } },
      },
    }),
    prisma.clinic.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  // flaten p/ tabela
  const rows = doctors.map((d) => ({
    id: d.id,
    name: d.name,
    crm: d.crm,
    specialty: d.specialty,
    email: d.email ?? null,
    phone: d.phone ?? null,
    clinicId: d.clinic?.id ?? null,
    clinicName: d.clinic?.name ?? null,
  }));

  return (
    <div className="grid gap-6">
      <Card>
        <CardTitle>Médicos</CardTitle>
        <DoctorsManager initialDoctors={rows} clinics={clinics} />
      </Card>
    </div>
  );
}
