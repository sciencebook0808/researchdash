import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const exp = await prisma.experiment.update({
    where: { id: params.id },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.evalLoss !== undefined && { evalLoss: Number(body.evalLoss) }),
      ...(body.evalAccuracy !== undefined && { evalAccuracy: Number(body.evalAccuracy) }),
      ...(body.pass1Score !== undefined && { pass1Score: Number(body.pass1Score) }),
      ...(body.bleuScore !== undefined && { bleuScore: Number(body.bleuScore) }),
    },
    include: { dataset: { select: { name: true } }, logs: true }
  })
  return NextResponse.json(exp)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.experiment.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
