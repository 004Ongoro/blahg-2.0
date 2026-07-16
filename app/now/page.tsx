import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FormattedDate } from '@/components/FormattedDate'
import { MarkdownContent } from '@/components/MarkdownContent'
import dbConnect from '@/lib/mongodb'
import Activity from '@/models/Activity'
import { 
  Briefcase, 
  BookOpen, 
  Book, 
  Headphones, 
  Gamepad2, 
  MapPin, 
  Clock,
  Sparkles
} from 'lucide-react'

export const metadata = {
  title: 'Now | George Ongoro',
  description: 'What I am working on, reading, learning, and focused on right now.',
}

// Statically generate the page; on-demand revalidation will update it when changes are made.
export const revalidate = 86400 // Fallback revalidation once per day

// Helper to map categories to colors, names, and icons
function getCategoryMeta(category: string) {
  switch (category) {
    case 'working':
      return {
        label: 'Working',
        bgClass: 'bg-blue-500/10 border-blue-500/20 text-blue-500 dark:text-blue-400',
        dotClass: 'bg-blue-500 ring-blue-500/20',
        glowClass: 'bg-blue-500/30',
        icon: <Briefcase className="h-4 w-4" />
      }
    case 'learning':
      return {
        label: 'Learning',
        bgClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 dark:text-emerald-400',
        dotClass: 'bg-emerald-500 ring-emerald-500/20',
        glowClass: 'bg-emerald-500/30',
        icon: <BookOpen className="h-4 w-4" />
      }
    case 'reading':
      return {
        label: 'Reading',
        bgClass: 'bg-amber-500/10 border-amber-500/20 text-amber-500 dark:text-amber-400',
        dotClass: 'bg-amber-500 ring-amber-500/20',
        glowClass: 'bg-amber-500/30',
        icon: <Book className="h-4 w-4" />
      }
    case 'listening':
      return {
        label: 'Listening',
        bgClass: 'bg-purple-500/10 border-purple-500/20 text-purple-500 dark:text-purple-400',
        dotClass: 'bg-purple-500 ring-purple-500/20',
        glowClass: 'bg-purple-500/30',
        icon: <Headphones className="h-4 w-4" />
      }
    case 'playing':
      return {
        label: 'Playing',
        bgClass: 'bg-rose-500/10 border-rose-500/20 text-rose-500 dark:text-rose-400',
        dotClass: 'bg-rose-500 ring-rose-500/20',
        glowClass: 'bg-rose-500/30',
        icon: <Gamepad2 className="h-4 w-4" />
      }
    default:
      return {
        label: 'Status',
        bgClass: 'bg-zinc-500/10 border-zinc-500/20 text-zinc-500 dark:text-zinc-400',
        dotClass: 'bg-zinc-500 ring-zinc-500/20',
        glowClass: 'bg-zinc-500/30',
        icon: <MapPin className="h-4 w-4" />
      }
  }
}

async function getActivities() {
  try {
    await dbConnect()
    const activities = await Activity.find({})
      .sort({ createdAt: -1 })
      .lean()
    
    return activities.map((act: any) => ({
      _id: act._id.toString(),
      content: act.content,
      category: act.category,
      emoji: act.emoji || '📍',
      createdAt: act.createdAt instanceof Date ? act.createdAt.toISOString() : new Date().toISOString()
    }))
  } catch (error) {
    console.error('Failed to load activities on /now page:', error)
    return []
  }
}

export default async function NowPage() {
  const activities = await getActivities()

  return (
    <div className="min-h-screen flex flex-col relative reading-page-bg font-mono">
      <Header />
      
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 md:py-24 w-full">
        {/* Header section */}
        <header className="mb-16 text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-accent/10 text-accent px-2 py-0.5 rounded inline-block">
            LIVE_LOGS
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase">
            What I'm Doing <span className="text-accent italic">Now</span>
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-wider leading-relaxed">
            A chronological feed of focus, work, and recreation. Inspired by the /now page movement.
          </p>
        </header>

        {activities.length === 0 ? (
          <div className="text-center py-20 border border-foreground/5 rounded-3xl bg-background/50 backdrop-blur">
            <Clock size={32} className="mx-auto text-muted-foreground/30 mb-4 animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              No entries logged
            </h3>
            <p className="text-[10px] text-muted-foreground/50 mt-1 uppercase tracking-wide">
              Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 md:pl-10 space-y-12">
            {/* The Timeline Track Line */}
            <div className="absolute left-[11px] md:left-[15px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-accent/30 via-foreground/5 to-transparent" />

            {activities.map((activity, index) => {
              const isNewest = index === 0
              const meta = getCategoryMeta(activity.category)

              return (
                <div 
                  key={activity._id} 
                  className="relative group transition-all duration-350"
                >
                  {/* Timeline Dot Node */}
                  <div className="absolute -left-[27px] md:-left-[35px] top-1.5 flex items-center justify-center">
                    <span className="relative flex h-4 w-4 items-center justify-center">
                      {isNewest && (
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${meta.glowClass}`}></span>
                      )}
                      <span className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-background shadow-md transition-transform duration-300 group-hover:scale-125 ${meta.dotClass}`} />
                    </span>
                  </div>

                  {/* Log Content Card */}
                  <div className={`p-6 border rounded-2xl transition-all duration-300 bg-background/60 backdrop-blur-sm ${
                    isNewest 
                      ? 'border-accent shadow-[0_0_15px_-3px_rgba(var(--accent-rgb,var(--color-accent)),0.1)] hover:bg-background/80' 
                      : 'border-foreground/5 hover:border-foreground/15 hover:bg-background/80'
                  }`}>
                    {/* Meta Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        {/* Emoji */}
                        <span className="text-lg">{activity.emoji}</span>
                        {/* Category badge */}
                        <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${meta.bgClass}`}>
                          {meta.label}
                        </span>
                        {isNewest && (
                          <span className="text-[8px] font-black uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded-full animate-pulse">
                            Active
                          </span>
                        )}
                      </div>
                      
                      {/* Formatted Date */}
                      <div className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={10} />
                        <FormattedDate date={activity.createdAt} relative={true} />
                      </div>
                    </div>

                    {/* Content text */}
                    <div className="prose prose-neutral dark:prose-invert max-w-none text-sm md:text-base leading-relaxed text-foreground/90 font-medium selection:bg-accent selection:text-accent-foreground">
                      <MarkdownContent content={activity.content} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
