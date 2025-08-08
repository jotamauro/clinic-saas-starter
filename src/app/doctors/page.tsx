import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/Card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { NewDoctorForm } from "./NewDoctorForm";

export default async function DoctorsPage() {
  const [doctors, clinics] = await Promise.all([
    prisma.doctor.findMany({ include: { clinic: true }, orderBy: { createdAt: "desc" } }),
    prisma.clinic.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardTitle>Novo Médico</CardTitle>
          <NewDoctorForm />
          <p className="text-xs text-gray-500 mt-2">
            Use o ID da clínica (copie da tabela ao lado) — podemos trocar por um select depois.
          </p>
        </Card>


      </div>
      <div>
        <Card>
          <CardTitle>Médicos</CardTitle>
          <Table>
            <THead>
              <TR><TH>Nome</TH><TH>CRM</TH><TH>Especialidade</TH><TH>Clínica</TH></TR>
            </THead>
            <TBody>
              {doctors.map((d) => (
                <TR key={d.id}>
                  <TD>{d.name}</TD>
                  <TD>{d.crm}</TD>
                  <TD>{d.specialty}</TD>
                  <TD title={d.clinic?.id}>{d.clinic?.name ?? "-"}</TD>
                </TR>
              ))}
            </TBody>
          </Table>

          {/* <div className="mt-6">
          <CardTitle>Clínicas (IDs para referência)</CardTitle>
          <Table>
            <THead><TR><TH>Nome</TH><TH>CNPJ</TH><TH>ID</TH></TR></THead>
            <TBody>
              {clinics.map((c) => (
                <TR key={c.id}>
                  <TD>{c.name}</TD>
                  <TD>{c.document}</TD>
                  <TD className="font-mono text-xs">{c.id}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div> */}
        </Card>
      </div>
    </>
  );
}
