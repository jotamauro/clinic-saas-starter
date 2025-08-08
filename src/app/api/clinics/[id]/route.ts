import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clinicSchema } from "@/schemas";

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const body = await req.json();

        // Valide apenas os campos editáveis (name, phone, address)
        const parsed = clinicSchema.pick({
            name: true,
            phone: true,
            address: true,
            document: true, // se quiser permitir trocar, mantenha; senão remova
        }).parse(body);

        const clinic = await prisma.clinic.update({
            where: { id },
            data: parsed,
        });

        return NextResponse.json(clinic, { status: 200 });
    } catch (err: any) {
        if (err?.name === "ZodError") {
            return NextResponse.json(
                { error: err.issues?.[0]?.message ?? "Dados inválidos" },
                { status: 400 }
            );
        }
        if (err?.code === "P2002") {
            return NextResponse.json(
                { error: "Já existe uma clínica com esse documento." },
                { status: 409 }
            );
        }
        console.error(err);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
