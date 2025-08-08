import { prisma } from "@/lib/prisma";
import { slotSchema } from "@/schemas";
import { requireRole } from "@/lib/authz";

export async function GET() {
  await requireRole(["ADMIN","MANAGER","DOCTOR","RECEPTION"]);
  const data = await prisma.slot.findMany({ include: { doctor:true }});
  return Response.json(data);
}

export async function POST(req: Request) {
  await requireRole(["ADMIN","MANAGER","DOCTOR"]);
  const body = await req.json();
  const parsed = slotSchema.safeParse(body);
  if (!parsed.success) return Response.json(parsed.error.format(), { status: 400 });
  const item = await prisma.slot.create({ data: parsed.data });
  return Response.json(item, { status: 201 });
}
