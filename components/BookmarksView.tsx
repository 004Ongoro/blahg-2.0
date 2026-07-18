'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, ExternalLink, Bookmark, Sparkles, Folder, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BookmarkItem {
  _id: string
  title: string
  url: string
  description: string
  category: 'tools' | 'libraries' | 'reads' | 'design' | 'inspiration' | 'other'
  tags: string[]
  createdAt: string
}

interface BookmarksViewProps {
  initialBookmarks: BookmarkItem[]
}

const categories = [
  { value: 'all', label: 'All Bookmarks' },
  { value: 'tools', label: 'Tools' },
  { value: 'libraries', label: 'Libraries' },
  { value: 'reads', label: 'Reads' },
  { value: 'design', label: 'Design' },
  { value: 'inspiration', label: 'Inspiration' },
  { value: 'other', label: 'Other' },
]

export function BookmarksView({ initialBookmarks }: BookmarksViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Get domain name to fetch favicon and print host
  const getDomainInfo = (urlStr: string) => {
    try {
      const url = new URL(urlStr)
      return {
        host: url.hostname.replace('www.', ''),
        favicon: `https://www.google.com/s2/favicons?sz=64&domain=${url.hostname}`,
      }
    } catch {
      return {
        host: 'link',
        favicon: '',
      }
    }
  }

  // Filter bookmarks in memory based on search query & category tab
  const filteredBookmarks = useMemo(() => {
    return initialBookmarks.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        getDomainInfo(item.url).host.toLowerCase().includes(searchLower)

      return matchesCategory && matchesSearch
    })
  }, [initialBookmarks, selectedCategory, searchQuery])

  // Count bookmarks in each category
  const categoryCounts = useMemo(() => {
    const counts: { [key: string]: number } = { all: initialBookmarks.length }
    initialBookmarks.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1
    })
    return counts
  }, [initialBookmarks])

  return (
    <div className="space-y-10">
      {/* Filter and Search Bar Container */}
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative w-full max-w-xl mx-auto">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground/50">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search bookmarks by title, tags, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-foreground/10 rounded-2xl h-12 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-1 ring-accent transition-all shadow-xs"
          />
        </div>

        {/* Category Navigation Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-4xl mx-auto">
          {categories.map((cat) => {
            const count = categoryCounts[cat.value] || 0
            // Hide categories with 0 bookmarks unless it is 'all'
            if (cat.value !== 'all' && count === 0) return null

            const isActive = selectedCategory === cat.value
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={cn(
                  "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2",
                  isActive
                    ? "bg-foreground text-background border border-foreground"
                    : "bg-foreground/[0.03] text-muted-foreground/70 hover:bg-foreground/5 border border-transparent hover:text-foreground"
                )}
              >
                {cat.label}
                <span className={cn(
                  "text-[8px] px-1.5 py-0.5 rounded-full font-black",
                  isActive ? "bg-background text-foreground" : "bg-foreground/10 text-muted-foreground"
                )}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBookmarks.map((bookmark) => {
          const { host, favicon } = getDomainInfo(bookmark.url)
          return (
            <div
              key={bookmark._id}
              className="group flex flex-col justify-between p-6 border border-foreground/5 bg-background hover:-translate-y-1 transition-all duration-300 rounded-[24px] shadow-sm hover:shadow-md relative overflow-hidden"
            >
              {/* Local indexable page link overlay */}
              <Link 
                href={`/bookmarks/${bookmark._id}`}
                className="absolute inset-0 z-0"
              />

              {/* Direct external link icon */}
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-0 right-0 h-10 w-10 border-b border-l border-foreground/5 bg-foreground/[0.02] flex items-center justify-center rounded-bl-xl hover:bg-accent/10 transition-colors duration-300 z-10"
                title="Visit website directly"
              >
                <ExternalLink size={10} className="text-muted-foreground/30 hover:text-accent transition-colors" />
              </a>

              <div className="space-y-4 relative z-0 pointer-events-none">
                {/* Header info */}
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-foreground/[0.03] border border-foreground/5 flex items-center justify-center p-1.5 shrink-0 select-none">
                    {favicon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={favicon} 
                        alt="" 
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.parentElement?.classList.add('fallback-icon')
                        }}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Bookmark size={12} className="text-accent" />
                    )}
                  </div>
                  <div className="space-y-0.5 overflow-hidden">
                    <span className="text-[8px] font-black uppercase text-muted-foreground/50 tracking-widest block">
                      {bookmark.category}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground/75 truncate block font-mono">
                      {host}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5">
                  <h3 className="text-sm font-black uppercase tracking-tight group-hover:text-accent transition-colors leading-snug line-clamp-2">
                    {bookmark.title}
                  </h3>
                  <p className="text-[11px] font-bold text-muted-foreground/60 leading-relaxed line-clamp-3">
                    {bookmark.description}
                  </p>
                </div>
              </div>

              {/* Tags and footer */}
              {bookmark.tags && bookmark.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-5 pt-4 border-t border-foreground/5 relative z-10">
                  {bookmark.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[8px] font-mono font-black uppercase tracking-wider bg-foreground/[0.03] text-muted-foreground/50 px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredBookmarks.length === 0 && (
        <div className="py-20 text-center space-y-3 opacity-40">
          <Sparkles className="h-8 w-8 text-accent mx-auto animate-pulse" />
          <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">
            No bookmarks discovered in this sector
          </p>
        </div>
      )}
    </div>
  )
}
