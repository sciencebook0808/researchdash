import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  const note = await prisma.note.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.content !== undefined && { content: body.content }),
      ...(body.tags !== undefined && { tags: body.tags }),
      ...(body.pinned !== undefined && { pinned: body.pinned }),
    }
  })

  return NextResponse.json(note)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  await prisma.note.delete({
    where: { id }
  })

  return NextResponse.json({ ok: true })
        }
