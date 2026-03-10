import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: { taskId: string } }) {
  const { completed } = await req.json()
  const task = await prisma.roadmapTask.update({
    where: { id: params.taskId },
    data: { completed }
  })
  return NextResponse.json(task)
}
