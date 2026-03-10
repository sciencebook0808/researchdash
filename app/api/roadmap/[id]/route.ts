import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const step = await prisma.roadmapStep.update({
    where: { id: params.id },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.title && { title: body.title }),
      ...(body.description && { description: body.description }),
    },
    include: { tasks: true }
  })
  return NextResponse.json(step)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.roadmapStep.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
