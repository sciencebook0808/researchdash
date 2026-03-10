import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const note = await prisma.note.update({
    where: { id: params.id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.content !== undefined && { content: body.content }),
      ...(body.tags !== undefined && { tags: body.tags }),
      ...(body.pinned !== undefined && { pinned: body.pinned }),
    }
  })
  return NextResponse.json(note)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.note.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
