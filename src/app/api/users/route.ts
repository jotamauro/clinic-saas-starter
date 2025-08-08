import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    const body = await req.json();

    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
        data: {
            // vincula usuário a uma clínica se clinicId vier no body
            clinics: body.clinicId ? { connect: [{ id: body.clinicId }] } : undefined,
            name: body.name,
            email: body.email,
            role: body.role,
            passwordHash,
        },
    });
    return NextResponse.json(user);
}
