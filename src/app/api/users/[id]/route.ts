import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const body = await req.json();

    const data: any = {
        name: body.name,
        role: body.role,
        // caso venha clinicId, define a clínica única vinculada
        clinics: body.clinicId ? { set: [{ id: body.clinicId }] } : undefined,
    };

    if (body.password) {
        data.passwordHash = await bcrypt.hash(body.password, 10);
    }

    const updatedUser = await prisma.user.update({
        where: { id: params.id },
        data,
        select: { id: true, name: true, email: true, role: true }
    });

    return NextResponse.json(updatedUser);
}
