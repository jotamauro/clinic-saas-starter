import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { token, code } = await req.json();
  const appt = await prisma.appointment.findFirst({
    where: {
      OR: [
        token ? { checkinToken: token } : undefined,
        code ? { checkinCode: code } : undefined,
      ].filter(Boolean) as any
    }
  });

  if (!appt) return Response.json({ error: "Invalid token/code" }, { status: 404 });

  const updated = await prisma.appointment.update({
    where: { id: appt.id },
    data: { status: "CHECKED_IN" }
  });

  return Response.json({ ok: true, appointmentId: updated.id });
}
