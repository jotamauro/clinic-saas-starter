import { prisma } from "@/lib/prisma";
import { clinicSchema } from "@/schemas";
import { requireRole } from "@/lib/authz";

export async function GET() {
  await requireRole(["ADMIN","MANAGER"]);
  const data = await prisma.clinic.findMany({ orderBy: { createdAt: "desc" }});
  return Response.json(data);
}

export async function POST(req: Request) {
  await requireRole(["ADMIN","MANAGER"]);
  const body = await req.json();
  const parsed = clinicSchema.safeParse(body);
  if (!parsed.success) return Response.json(parsed.error.format(), { status: 400 });
  const clinic = await prisma.clinic.create({ data: parsed.data });
  return Response.json(clinic, { status: 201 });
}
