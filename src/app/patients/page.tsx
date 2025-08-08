import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/Card";
import { PatientsManager } from "./PatientsManager";

export default async function PatientsPage() {
  const patients = await prisma.patient.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, document: true, email: true, phone: true },
  });

  return (
    <div className="grid gap-6">
      <Card>
        <CardTitle>Pacientes</CardTitle>
        <PatientsManager initialPatients={patients} />
      </Card>
    </div>
  );
}
