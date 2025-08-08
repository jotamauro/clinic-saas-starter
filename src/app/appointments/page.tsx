// src/app/appointments/page.tsx
import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/Card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { NewAppointmentForm } from "./NewAppointmentForm";

export default async function AppointmentsPage() {
  const [clinics, doctors, patients, appts] = await Promise.all([
    prisma.clinic.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.doctor.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.patient.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.appointment.findMany({
      include: { clinic: true, doctor: true, patient: true },
      orderBy: { startsAt: "desc" },
    }),
  ]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardTitle>Nova Consulta</CardTitle>
        <NewAppointmentForm />
        <p className="text-xs text-gray-500 mt-2">
          Ao criar, um token/código de check-in é gerado automaticamente.
        </p>
      </Card>

      <Card>
        <CardTitle>Consultas</CardTitle>
        <Table>
          <THead>
            <TR><TH>Data</TH><TH>Clínica</TH><TH>Médico</TH><TH>Paciente</TH><TH>Status</TH></TR>
          </THead>
        </Table>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <TBody>
              {appts.map((a) => (
                <TR key={a.id}>
                  <TD>{new Date(a.startsAt).toLocaleString()}</TD>
                  <TD title={a.clinic?.id}>{a.clinic?.name ?? "-"}</TD>
                  <TD title={a.doctor?.id}>{a.doctor?.name ?? "-"}</TD>
                  <TD title={a.patient?.id}>{a.patient?.name ?? "-"}</TD>
                  <TD>{a.status}</TD>
                </TR>
              ))}
            </TBody>
          </table>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div>
            <CardTitle>Clínicas</CardTitle>
            <Table>
              <THead><TR><TH>Nome</TH><TH>ID</TH></TR></THead>
              <TBody>{clinics.map(c => (
                <TR key={c.id}><TD>{c.name}</TD><TD className="font-mono text-xs">{c.id}</TD></TR>
              ))}</TBody>
            </Table>
          </div>
          <div>
            <CardTitle>Médicos</CardTitle>
            <Table>
              <THead><TR><TH>Nome</TH><TH>ID</TH></TR></THead>
              <TBody>{doctors.map(d => (
                <TR key={d.id}><TD>{d.name}</TD><TD className="font-mono text-xs">{d.id}</TD></TR>
              ))}</TBody>
            </Table>
          </div>
          <div>
            <CardTitle>Pacientes</CardTitle>
            <Table>
              <THead><TR><TH>Nome</TH><TH>ID</TH></TR></THead>
              <TBody>{patients.map(p => (
                <TR key={p.id}><TD>{p.name}</TD><TD className="font-mono text-xs">{p.id}</TD></TR>
              ))}</TBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}
