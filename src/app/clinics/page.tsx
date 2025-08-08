import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/Card";
import { ClinicsManager } from "./ClinicsManager";

export default async function ClinicsPage() {
  const clinics = await prisma.clinic.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, document: true, phone: true, address: true },
  });

  return (
    <div className="grid gap-6">
      <Card>
        <CardTitle>Clínicas</CardTitle>
        <ClinicsManager initialClinics={clinics} />
      </Card>
    </div>
  );
}
