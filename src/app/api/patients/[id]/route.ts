import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { patientSchema } from "@/schemas";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const body = await req.json();

        // Valide só os campos permitidos
        const parsed = patientSchema.pick({
            name: true,
            document: true,
            email: true,
            phone: true,
        }).parse(body);

        const patient = await prisma.patient.update({
            where: { id },
            data: parsed,
        });

        return NextResponse.json(patient, { status: 200 });
    } catch (err: any) {
        if (err?.name === "ZodError") {
            return NextResponse.json({ error: err.issues?.[0]?.message ?? "Dados inválidos" }, { status: 400 });
        }
        if (err?.code === "P2002") {
            return NextResponse.json({ error: "Já existe um paciente com esses dados únicos." }, { status: 409 });
        }
        console.error(err);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
