import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PostList } from '@/components/PostList'
import { Newsletter } from '@/components/Newsletter'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

async function getPosts(page: number = 1, limit: number = 10) {
  try {
    await dbConnect()
    const skip = (page - 1) * limit
    
    const [posts, total] = await Promise.all([
      Post.find({ published: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-content')
        .lean(),
      Post.countDocuments({ published: true })
    ])
    
    return {
      posts: JSON.parse(JSON.stringify(posts)),
      totalPages: Math.ceil(total / limit),
      currentPage: page
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return { posts: [], totalPages: 0, currentPage: 1 }
  }
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1
  const limit = 10
  
  const { posts, totalPages, currentPage } = await getPosts(page, limit)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 md:py-20 w-full">
        <section className="mb-20">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
              Latest <span className="text-accent italic">Posts</span>
            </h1>
            <p className="text-muted-foreground font-medium">
              Thoughts on software, design, and building things.
            </p>
          </header>

          <PostList posts={posts} />

          {totalPages > 1 && (
            <div className="mt-16 pt-8 border-t border-foreground/5">
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious href={`/?page=${currentPage - 1}`} />
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
                            href={`/?page=${pageNum}`}
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
                      <PaginationNext href={`/?page=${currentPage + 1}`} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </section>

        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
