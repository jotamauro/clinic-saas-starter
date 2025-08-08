import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/Card";
import { NewContractForm } from "./NewContractForm";
import { ContractsTable } from "./ContractsTable";

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

  const rows = contracts.map((c) => ({
    id: c.id,
    clinicId: c.clinic?.id ?? "",
    clinicName: c.clinic?.name ?? "",
    doctorId: c.doctor?.id ?? "",
    doctorName: c.doctor?.name ?? "",
    startDate: c.startDate,
    endDate: c.endDate,
    revenueShare: c.revenueShare, // 0..1
    isActive: c.isActive,
  }));

  return (
    <div className="grid gap-6">
      {/* Form em cima */}
      <Card>
        <CardTitle>Novo Contrato</CardTitle>
        <NewContractForm clinics={clinics} doctors={doctors} />
      </Card>

      {/* Lista embaixo com filtros */}
      <Card>
        <CardTitle>Contratos</CardTitle>
        <ContractsTable data={rows} />
      </Card>
    </div>
  );
}
