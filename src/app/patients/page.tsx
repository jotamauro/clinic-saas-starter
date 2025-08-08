import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/Card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { NewPatientForm } from "./NewPatientForm";

export default async function PatientsPage() {
  const patients = await prisma.patient.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardTitle>Novo Paciente</CardTitle>
        <NewPatientForm />
      </Card>

      <Card>
        <CardTitle>Pacientes</CardTitle>
        <Table>
          <THead>
            <TR><TH>Nome</TH><TH>Documento</TH><TH>Email</TH><TH>Telefone</TH></TR>
          </THead>
          <TBody>
            {patients.map((p) => (
              <TR key={p.id}>
                <TD>{p.name}</TD>
                <TD>{p.document ?? "-"}</TD>
                <TD>{p.email ?? "-"}</TD>
                <TD>{p.phone ?? "-"}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
