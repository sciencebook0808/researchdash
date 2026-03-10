import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const datasets = await prisma.dataset.findMany({
    orderBy: { createdAt: "desc" }
  })
  return NextResponse.json(datasets.map(d => ({
    ...d,
    sizeBytes: d.sizeBytes?.toString() ?? null,
    numSamples: d.numSamples
  })))
}

export async function POST(req: Request) {
  const body = await req.json()
  const dataset = await prisma.dataset.create({
    data: {
      name: body.name,
      description: body.description,
      sourceUrl: body.sourceUrl,
      datasetType: body.datasetType || "CODE",
      numSamples: body.numSamples ? Number(body.numSamples) : null,
      sizeBytes: body.sizeBytes ? BigInt(body.sizeBytes) : null,
      preprocessStatus: "RAW",
      tags: body.tags || [],
      format: body.format,
      license: body.license,
    }
  })
  return NextResponse.json({ ...dataset, sizeBytes: dataset.sizeBytes?.toString() ?? null })
}
