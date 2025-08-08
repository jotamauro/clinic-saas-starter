import { prisma } from "@/lib/prisma";
import { NewClinicForm } from "./NewClinicForm";

export default async function ClinicsPage() {
  const clinics = await prisma.clinic.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Nova Clínica</h2>
        <NewClinicForm />
      </section>

      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Clínicas</h2>

        {clinics.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma clínica cadastrada.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100 text-left">
                <tr className="border-b">
                  <th className="px-3 py-2">Nome</th>
                  <th className="px-3 py-2">CNPJ</th>
                  <th className="px-3 py-2">Telefone</th>
                  <th className="px-3 py-2">Endereço</th>
                </tr>
              </thead>
              <tbody>
                {clinics.map((c) => (
                  <tr key={c.id} className="border-b">
                    <td className="px-3 py-2">{c.name}</td>
                    <td className="px-3 py-2">{c.document}</td>
                    <td className="px-3 py-2">{c.phone ?? "-"}</td>
                    <td className="px-3 py-2">{c.address ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
