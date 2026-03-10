import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const steps = await prisma.roadmapStep.findMany({
    orderBy: { order: "asc" },
    include: { tasks: { orderBy: { createdAt: "asc" } } }
  })
  return NextResponse.json(steps)
}

export async function POST(req: Request) {
  const body = await req.json()
  const step = await prisma.roadmapStep.create({
    data: {
      phase: body.phase,
      title: body.title,
      description: body.description || "",
      status: "PENDING",
      order: body.order || 99,
      tasks: body.tasks ? { create: body.tasks } : undefined
    },
    include: { tasks: true }
  })
  return NextResponse.json(step)
}
