import { prisma } from "@/lib/prisma";
import { contractSchema } from "@/schemas";
import { requireRole } from "@/lib/authz";

export async function GET() {
  await requireRole(["ADMIN","MANAGER"]);
  const data = await prisma.contract.findMany({ include:{ clinic:true, doctor:true }});
  return Response.json(data);
}

export async function POST(req: Request) {
  await requireRole(["ADMIN","MANAGER"]);
  const body = await req.json();
  const parsed = contractSchema.safeParse(body);
  if (!parsed.success) return Response.json(parsed.error.format(), { status: 400 });
  const { startDate, endDate, ...rest } = parsed.data;
  const item = await prisma.contract.create({
    data: {
      ...rest,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
    }
  });
  return Response.json(item, { status: 201 });
}
