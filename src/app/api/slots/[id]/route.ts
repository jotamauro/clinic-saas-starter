import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import { slotSchema } from "@/schemas"; // se tiver schema, use pick

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const body = await req.json();

        // Valide/converta
        const data = {
            doctorId: String(body.doctorId),
            weekday: Number(body.weekday),
            startTime: String(body.startTime),
            endTime: String(body.endTime),
            durationMin: Number(body.durationMin),
        };

        // Se usar Zod:
        // const parsed = slotSchema.pick({ doctorId:true, weekday:true, startTime:true, endTime:true, durationMin:true }).parse(data);

        const updated = await prisma.slot.update({
            where: { id },
            data, // ou parsed
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
