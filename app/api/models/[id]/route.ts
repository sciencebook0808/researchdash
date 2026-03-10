import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const model = await prisma.modelVersion.update({
    where: { id: params.id },
    data: {
      ...(body.isDeployed !== undefined && { isDeployed: body.isDeployed }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.pass1Score !== undefined && { pass1Score: Number(body.pass1Score) }),
      ...(body.bleuScore !== undefined && { bleuScore: Number(body.bleuScore) }),
    }
  })
  return NextResponse.json({
    ...model,
    parameterCount: model.parameterCount?.toString() ?? null,
    fileSizeBytes: model.fileSizeBytes?.toString() ?? null,
  })
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.modelVersion.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
