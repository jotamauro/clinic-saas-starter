import { prisma } from "@/lib/prisma";
import { patientSchema } from "@/schemas";
import { requireRole } from "@/lib/authz";

export async function GET() {
  await requireRole(["ADMIN","MANAGER","DOCTOR","RECEPTION"]);
  const data = await prisma.patient.findMany({ orderBy: { createdAt: "desc" }});
  return Response.json(data);
}

export async function POST(req: Request) {
  await requireRole(["ADMIN","MANAGER","RECEPTION"]);
  const body = await req.json();
  const parsed = patientSchema.safeParse(body);
  if (!parsed.success) return Response.json(parsed.error.format(), { status: 400 });
  const patient = await prisma.patient.create({ data: parsed.data });
  return Response.json(patient, { status: 201 });
}
