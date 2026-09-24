import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PostList } from '@/components/PostList'
import { Newsletter } from '@/components/Newsletter'
import { GooglePreferredSourceButton } from '@/components/GooglePreferredSourceButton'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import { cn } from '@/lib/utils'
import { BookOpen, Zap, Layers } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type FilterType = 'all' | 'articles' | 'notes'

async function getPosts(page: number = 1, limit: number = 10, filter: FilterType = 'all') {
  try {
    await dbConnect()
    const skip = (page - 1) * limit

    let query: Record<string, any> = { published: true, isDraft: { $ne: true } }
    if (filter === 'articles') {
      query.type = { $ne: 'note' }
    } else if (filter === 'notes') {
      query.type = 'note'
    }

    const [posts, total, countArticles, countNotes] = await Promise.all([
      Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-content')
        .lean(),
      Post.countDocuments(query),
      Post.countDocuments({ published: true, isDraft: { $ne: true }, type: { $ne: 'note' } }),
      Post.countDocuments({ published: true, isDraft: { $ne: true }, type: 'note' })
    ])

    return {
      posts: JSON.parse(JSON.stringify(posts)),
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      counts: {
        all: countArticles + countNotes,
        articles: countArticles,
        notes: countNotes,
      }
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return { posts: [], totalPages: 0, currentPage: 1, counts: { all: 0, articles: 0, notes: 0 } }
  }
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1
  const rawFilter = typeof params.filter === 'string' ? params.filter.toLowerCase() : 'all'
  const filter: FilterType = rawFilter === 'articles' || rawFilter === 'notes' ? rawFilter : 'all'
  const limit = 10

  const { posts, totalPages, currentPage, counts } = await getPosts(page, limit, filter)

  const makePageUrl = (pageNum: number) => {
    const filterQuery = filter !== 'all' ? `filter=${filter}&` : ''
    return `/?${filterQuery}page=${pageNum}`
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-20 md:py-28 w-full space-y-12">
        {/* Hero Section Header */}
        <section className="space-y-4">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-black tracking-tight text-foreground leading-[1.1]">
              {filter === 'notes' ? (
                <>Short <span className="text-accent italic font-serif">Notes</span></>
              ) : filter === 'articles' ? (
                <>Latest <span className="text-accent italic font-serif">Articles</span></>
              ) : (
                <>Engineering <span className="text-accent italic font-serif">Feed</span></>
              )}
            </h1>
            <p className="text-base md:text-lg font-sans text-muted-foreground leading-relaxed max-w-xl">
              {filter === 'notes'
                ? 'Quick insights, micro-learnings, and field observations under 30 seconds.'
                : filter === 'articles'
                ? 'In-depth essays on software engineering, distributed systems, and clean architecture.'
                : 'Writing on software engineering, distributed systems, clean architecture, and quick technical notes.'}
            </p>
          </div>
          <div className="pt-2">
            <GooglePreferredSourceButton />
          </div>
        </section>

        {/* Feed Filter Toggle Bar */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-1.5 p-1 bg-card/80 border border-border rounded-xl backdrop-blur-xs font-mono text-xs w-fit">
            <Link
              href="/"
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all font-bold uppercase tracking-wider text-[11px]",
                filter === 'all'
                  ? "bg-foreground text-background shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Layers size={12} className="opacity-70" />
              <span>All</span>
              <span className="text-[10px] opacity-70">({counts.all})</span>
            </Link>

            <Link
              href="/?filter=articles"
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all font-bold uppercase tracking-wider text-[11px]",
                filter === 'articles'
                  ? "bg-foreground text-background shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <BookOpen size={12} className="opacity-70" />
              <span>Articles</span>
              <span className="text-[10px] opacity-70">({counts.articles})</span>
            </Link>

            <Link
              href="/?filter=notes"
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all font-bold uppercase tracking-wider text-[11px]",
                filter === 'notes'
                  ? "bg-accent text-accent-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Zap size={12} />
              <span>Notes</span>
              <span className="text-[10px] opacity-80">({counts.notes})</span>
            </Link>
          </div>

          <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest hidden sm:block">
            {posts.length} {posts.length === 1 ? 'entry' : 'entries'} shown
          </div>
        </section>

        {/* Post Feed Grid/List */}
        <section>
          <PostList posts={posts} />

          {totalPages > 1 && (
            <div className="mt-14 pt-8 border-t border-border">
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious href={makePageUrl(currentPage - 1)} />
                    </PaginationItem>
                  )}

                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href={makePageUrl(pageNum)}
                            isActive={currentPage === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }
                    return null
                  })}

                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext href={makePageUrl(currentPage + 1)} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </section>

        {/* Newsletter Subscription Feature */}
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
