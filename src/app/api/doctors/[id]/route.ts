import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { doctorSchema } from "@/schemas";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const body = await req.json();

        // valide apenas os campos do form (ajuste conforme seu schema)
        const parsed = doctorSchema.pick({
            clinicId: true,
            name: true,
            crm: true,
            specialty: true,
            email: true,
            phone: true,
        }).parse(body);

        const doctor = await prisma.doctor.update({
            where: { id },
            data: parsed,
        });

        return NextResponse.json(doctor, { status: 200 });
    } catch (err: any) {
        if (err?.name === "ZodError") {
            return NextResponse.json({ error: err.issues?.[0]?.message ?? "Dados inválidos" }, { status: 400 });
        }
        if (err?.code === "P2002") {
            return NextResponse.json({ error: "Conflito com campo único (ex.: CRM já usado)." }, { status: 409 });
        }
        console.error(err);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
