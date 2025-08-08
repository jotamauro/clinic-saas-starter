import { Card, CardTitle } from "@/components/ui/Card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { headers } from "next/headers";
import { CreateContractForm } from "./CreateContractForm";

async function getJSON(path: string) {
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const cookie = headers().get("cookie") ?? "";
  const res = await fetch(`${base}${path}`, { cache: "no-store", headers: { cookie } });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`GET ${path} -> ${res.status} ${txt}`);
  }
  return res.json();
}

async function getContracts() { return getJSON("/api/contracts"); }
async function getClinics() { return getJSON("/api/clinics"); }
async function getDoctors() { return getJSON("/api/doctors"); }

export default async function ContractsPage() {
  const [contracts, clinics, doctors] = await Promise.all([
    getContracts(), getClinics(), getDoctors()
  ]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardTitle>Novo Contrato</CardTitle>
        <CreateContractForm />
      </Card>

      <Card>
        <CardTitle>Contratos</CardTitle>
        <Table>
          <THead>
            <TR><TH>Clínica</TH><TH>Médico</TH><TH>Início</TH><TH>Repasse</TH><TH>Ativo</TH></TR>
          </THead>
          <TBody>
            {contracts.map((c: any) => (
              <TR key={c.id}>
                <TD title={c.clinic?.id}>{c.clinic?.name ?? "-"}</TD>
                <TD title={c.doctor?.id}>{c.doctor?.name ?? "-"}</TD>
                <TD>{new Date(c.startDate).toLocaleDateString()}</TD>
                <TD>{(c.revenueShare * 100).toFixed(0)}%</TD>
                <TD>{c.isActive ? "Sim" : "Não"}</TD>
              </TR>
            ))}
          </TBody>
        </Table>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <CardTitle>Clínicas</CardTitle>
            <Table>
              <THead><TR><TH>Nome</TH><TH>ID</TH></TR></THead>
              <TBody>{clinics.map((x: any) => (
                <TR key={x.id}><TD>{x.name}</TD><TD className="font-mono text-xs">{x.id}</TD></TR>
              ))}</TBody>
            </Table>
          </div>
          <div>
            <CardTitle>Médicos</CardTitle>
            <Table>
              <THead><TR><TH>Nome</TH><TH>ID</TH></TR></THead>
              <TBody>{doctors.map((x: any) => (
                <TR key={x.id}><TD>{x.name}</TD><TD className="font-mono text-xs">{x.id}</TD></TR>
              ))}</TBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}
