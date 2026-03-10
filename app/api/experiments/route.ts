import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const experiments = await prisma.experiment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      dataset: { select: { name: true } },
      logs: { orderBy: { step: "asc" } }
    }
  })
  return NextResponse.json(experiments)
}

export async function POST(req: Request) {
  const body = await req.json()
  const exp = await prisma.experiment.create({
    data: {
      name: body.name,
      description: body.description,
      baseModel: body.baseModel,
      datasetId: body.datasetId || null,
      status: "PENDING",
      loraRank: body.loraRank ? Number(body.loraRank) : null,
      loraAlpha: body.loraAlpha ? Number(body.loraAlpha) : null,
      batchSize: body.batchSize ? Number(body.batchSize) : null,
      learningRate: body.learningRate ? Number(body.learningRate) : null,
      epochs: body.epochs ? Number(body.epochs) : null,
      config: body.config || null,
    },
    include: { dataset: { select: { name: true } }, logs: true }
  })
  return NextResponse.json(exp)
}
