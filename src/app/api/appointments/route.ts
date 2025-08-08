import { prisma } from "@/lib/prisma";
import { appointmentSchema } from "@/schemas";
import { requireRole } from "@/lib/authz";
import { generateCheckinCode, generateCheckinToken } from "@/lib/checkin";

export async function GET() {
  await requireRole(["ADMIN","MANAGER","DOCTOR","RECEPTION"]);
  const data = await prisma.appointment.findMany({
    include: { clinic:true, doctor:true, patient:true },
    orderBy: { startsAt: "asc" }
  });
  return Response.json(data);
}

export async function POST(req: Request) {
  await requireRole(["ADMIN","MANAGER","RECEPTION"]);
  const body = await req.json();
  const parsed = appointmentSchema.safeParse(body);
  if (!parsed.success) return Response.json(parsed.error.format(), { status: 400 });

  const startsAt = new Date(parsed.data.startsAt);
  const appointment = await prisma.appointment.create({
    data: {
      ...parsed.data,
      startsAt,
      endsAt: new Date(startsAt.getTime() + 30 * 60 * 1000),
      checkinToken: generateCheckinToken(),
      checkinCode: generateCheckinCode(),
    }
  });

  return Response.json(appointment, { status: 201 });
}
