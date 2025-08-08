import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import { appointmentSchema } from "@/schemas";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const body = await req.json();

        const data = {
            clinicId: String(body.clinicId),
            doctorId: String(body.doctorId),
            patientId: String(body.patientId),
            startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
            status: body.status ?? undefined,
        };

        // Se estiver usando Zod:
        // const parsed = appointmentSchema.pick({ clinicId:true, doctorId:true, patientId:true, startsAt:true }).parse({
        //   ...data, startsAt: data.startsAt?.toISOString()
        // });

        const updated = await prisma.appointment.update({
            where: { id },
            data: data,
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (err: any) {
        if (err?.name === "ZodError") {
            return NextResponse.json({ error: err.issues?.[0]?.message ?? "Dados inválidos" }, { status: 400 });
        }
        console.error(err);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
