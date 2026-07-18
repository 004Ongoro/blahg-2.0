import { notFound } from 'next/navigation'
import Link from 'next/link'
import mongoose from 'mongoose'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import dbConnect from '@/lib/mongodb'
import Bookmark from '@/models/Bookmark'
import { getBaseUrl } from '@/lib/utils'
import { ArrowLeft, ExternalLink, Calendar, Tag, Compass } from 'lucide-react'

export const dynamic = 'force-static'
export const revalidate = 60 // Revalidate page cache every 60 seconds

// Static generation
export async function generateStaticParams() {
  try {
    await dbConnect()
    const bookmarks = await Bookmark.find({}).select('_id').lean()
    return bookmarks.map((b: any) => ({
      id: b._id.toString(),
    }))
  } catch (error) {
    console.error('Error in generateStaticParams for bookmarks:', error)
    return []
  }
}

interface Props {
  params: Promise<{ id: string }>
}

// Data fetching
async function getBookmark(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null
  }
  try {
    await dbConnect()
    const bookmark = await Bookmark.findById(id).lean()
    return bookmark ? JSON.parse(JSON.stringify(bookmark)) : null
  } catch (error) {
    console.error('Error fetching bookmark:', error)
    return null
  }
}

async function getRelatedBookmarks(category: string, currentId: string) {
  try {
    await dbConnect()
    const bookmarks = await Bookmark.find({
      category,
      _id: { $ne: currentId }
    })
    .limit(3)
    .lean()
    return JSON.parse(JSON.stringify(bookmarks))
  } catch (error) {
    console.error('Error fetching related bookmarks:', error)
    return []
  }
}

// Metadata generation
export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const bookmark = await getBookmark(id)
  
  if (!bookmark) {
    return {
      title: 'Bookmark Not Found | George Ongoro',
    }
  }

  return {
    title: `${bookmark.title} | Bookmarks | George Ongoro`,
    description: bookmark.description,
    openGraph: {
      title: `${bookmark.title} | George Ongoro's Bookmarks`,
      description: bookmark.description,
      type: 'website',
    },
  }
}

export default async function BookmarkDetailPage({ params }: Props) {
  const { id } = await params
  const bookmark = await getBookmark(id)

  if (!bookmark) {
    notFound()
  }

  const related = await getRelatedBookmarks(bookmark.category, bookmark._id)

  // Get domain name to print host
  let host = 'link'
  let favicon = ''
  try {
    const url = new URL(bookmark.url)
    host = url.hostname.replace('www.', '')
    favicon = `https://www.google.com/s2/favicons?sz=128&domain=${url.hostname}`
  } catch {}

  const formattedDate = new Date(bookmark.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen flex flex-col relative reading-page-bg">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 md:py-24 w-full">
        {/* Back Link */}
        <Link 
          href="/bookmarks"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-foreground mb-8 transition-colors group cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Bookmarks
        </Link>

        {/* Hero Section */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-wider bg-accent/15 text-accent px-3 py-1 rounded-full border border-accent/10">
              {bookmark.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60 font-mono">
              <Calendar size={12} />
              <span>{formattedDate}</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-none break-words">
                {bookmark.title}
              </h1>
              <p className="text-sm font-bold text-muted-foreground/75 font-mono">
                {host}
              </p>
            </div>
            
            {favicon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={favicon} 
                alt="" 
                className="w-16 h-16 rounded-2xl bg-foreground/[0.03] border border-foreground/5 p-2 shrink-0 select-none object-contain shadow-xs animate-in zoom-in-95 duration-200"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
          </div>
        </div>

        {/* Content Block */}
        <div className="p-8 border border-foreground/10 bg-background/50 backdrop-blur-md rounded-[32px] shadow-sm space-y-6 mb-12 relative overflow-hidden">
          {/* Decorative backdrop glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 relative">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Description
            </h2>
            <p className="text-base md:text-lg font-medium text-foreground leading-relaxed">
              {bookmark.description}
            </p>
          </div>

          {bookmark.tags && bookmark.tags.length > 0 && (
            <div className="space-y-2 pt-6 border-t border-foreground/5 relative">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 flex items-center gap-1.5">
                <Tag size={10} />
                Associated Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {bookmark.tags.map((tag: string) => (
                  <span 
                    key={tag}
                    className="text-[10px] font-mono font-black uppercase tracking-wider bg-foreground/[0.05] text-muted-foreground/70 px-3 py-1 rounded-lg border border-foreground/5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-6 relative">
            <a 
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-foreground text-background hover:bg-foreground/90 transition-all font-black uppercase text-xs tracking-widest rounded-full shadow-md hover:shadow-lg active:scale-95 duration-100 cursor-pointer w-full md:w-auto"
            >
              Visit Resource
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Related / Other Bookmarks */}
        {related.length > 0 && (
          <section className="space-y-6 pt-12 border-t border-foreground/5">
            <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Compass size={14} className="text-accent" />
              More in {bookmark.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((item: any) => {
                let itemHost = 'link'
                try {
                  itemHost = new URL(item.url).hostname.replace('www.', '')
                } catch {}
                return (
                  <Link
                    key={item._id}
                    href={`/bookmarks/${item._id}`}
                    className="p-5 border border-foreground/5 bg-background/30 hover:bg-background/80 hover:-translate-y-0.5 transition-all rounded-2xl flex flex-col justify-between h-full group"
                  >
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-muted-foreground/60 block">
                        {itemHost}
                      </span>
                      <h3 className="text-xs font-black uppercase tracking-tight line-clamp-2 group-hover:text-accent transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  )
}
