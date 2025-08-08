// src/app/dashboard/page.tsx
import { prisma } from "@/lib/prisma";

async function getCounts() {
  const [clinics, patients, appointments, contracts] = await Promise.all([
    prisma.clinic.count(),
    prisma.patient.count(),
    prisma.appointment.count(),
    prisma.contract.count(),
  ]);
  return { clinics, patients, appointments, contracts };
}

export default async function DashboardPage() {
  const counts = await getCounts();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      {/* KPIs */}
      <KPIGrid counts={counts} />
    </div>
  );
}

// componentes client abaixo
import KPIGrid from "./_components/KPIGrid";
