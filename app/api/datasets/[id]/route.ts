import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const dataset = await prisma.dataset.update({
    where: { id: params.id },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.preprocessStatus && { preprocessStatus: body.preprocessStatus }),
      ...(body.numSamples !== undefined && { numSamples: Number(body.numSamples) }),
      ...(body.tags && { tags: body.tags }),
    }
  })
  return NextResponse.json({
    ...dataset,
    sizeBytes: dataset.sizeBytes?.toString() ?? null,
  })
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.dataset.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
