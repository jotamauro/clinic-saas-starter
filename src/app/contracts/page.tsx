import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/Card";
import { ContractsManager } from "./ContractsManager";

export default async function ContractsPage() {
  const [contracts, clinics, doctors] = await Promise.all([
    prisma.contract.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        revenueShare: true,
        isActive: true,
        clinic: { select: { id: true, name: true } },
        doctor: { select: { id: true, name: true } },
      },
    }),
    prisma.clinic.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.doctor.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  const rows = contracts.map(c => ({
    id: c.id,
    clinicId: c.clinic?.id ?? "",
    clinicName: c.clinic?.name ?? "",
    doctorId: c.doctor?.id ?? "",
    doctorName: c.doctor?.name ?? "",
    startDate: c.startDate?.toISOString() ?? "",
    endDate: c.endDate ? c.endDate.toISOString() : "",
    revenueShare: c.revenueShare ?? 0,
    isActive: c.isActive,
  }));

  return (
    <div className="grid gap-6">
      <Card>
        <CardTitle>Contratos</CardTitle>
        <ContractsManager initialContracts={rows} clinics={clinics} doctors={doctors} />
      </Card>
    </div>
  );
}
