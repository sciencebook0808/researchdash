import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { DocContent } from "@/components/docs/doc-content"
import Link from "next/link"
import { ChevronLeft, Clock, Tag } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const pages = await prisma.documentationPage.findMany({
    select: { slug: true }
  })

  return pages.map((p) => ({ slug: p.slug }))
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params

  const page = await prisma.documentationPage.findUnique({
    where: { slug },
  })

  if (!page) notFound()

  const allPages = await prisma.documentationPage.findMany({
    where: { section: page.section },
    orderBy: { order: "asc" },
    select: { id: true, title: true, slug: true }
  })

  const currentIndex = allPages.findIndex((p) => p.slug === page.slug)
  const prev = currentIndex > 0 ? allPages[currentIndex - 1] : null
  const next = currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null

  return (
    <div className="max-w-4xl animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-muted-foreground mb-6">
        <Link href="/docs" className="hover:text-amber-400 transition-colors flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5" />
          Documentation
        </Link>
        <span>/</span>
        <span className="text-amber-400">{page.section}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-3">
          {page.title}
        </h1>

        <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Updated {formatDate(page.updatedAt)}
          </span>

          <div className="flex items-center gap-1.5">
            {page.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-[11px]"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-xl border border-border bg-card p-8">
        <DocContent content={page.content} />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 gap-4">
        {prev ? (
          <Link
            href={`/docs/${prev.slug}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card hover:border-amber-500/30 transition-colors text-[13px] text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
            {prev.title}
          </Link>
        ) : (
          <div />
        )}

        {next && (
          <Link
            href={`/docs/${next.slug}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card hover:border-amber-500/30 transition-colors text-[13px] text-muted-foreground hover:text-foreground ml-auto"
          >
            {next.title}
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </Link>
        )}
      </div>
    </div>
  )
}
