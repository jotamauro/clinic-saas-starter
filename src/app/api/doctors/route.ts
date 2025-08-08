import { prisma } from "@/lib/prisma";
import { doctorSchema } from "@/schemas";
import { requireRole } from "@/lib/authz";

export async function GET() {
  await requireRole(["ADMIN","MANAGER","RECEPTION"]);
  const data = await prisma.doctor.findMany({ include:{ clinic:true }});
  return Response.json(data);
}

export async function POST(req: Request) {
  await requireRole(["ADMIN","MANAGER"]);
  const body = await req.json();
  const parsed = doctorSchema.safeParse(body);
  if (!parsed.success) return Response.json(parsed.error.format(), { status: 400 });
  const item = await prisma.doctor.create({ data: parsed.data });
  return Response.json(item, { status: 201 });
}
