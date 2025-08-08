import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contractSchema } from "@/schemas";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const body = await req.json();

        // valide os campos permitidos (ajuste conforme seu schema)
        const parsed = contractSchema.pick({
            clinicId: true,
            doctorId: true,
            startDate: true,
            endDate: true,
            revenueShare: true,
            isActive: true,
        }).parse(body);

        const updated = await prisma.contract.update({
            where: { id },
            data: parsed,
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (err: any) {
        if (err?.name === "ZodError") {
            return NextResponse.json({ error: err.issues?.[0]?.message ?? "Dados inválidos" }, { status: 400 });
        }
        if (err?.code === "P2002") {
            return NextResponse.json({ error: "Conflito com dados únicos de contrato." }, { status: 409 });
        }
        console.error(err);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
