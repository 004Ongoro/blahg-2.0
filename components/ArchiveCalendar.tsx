'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isToday, addMonths, subMonths } from 'date-fns'
import { cn } from '@/lib/utils'
import { FileText, Mail, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface ArchiveItem {
  id: string
  title: string
  slug: string
  date: Date
  type: 'post' | 'newsletter'
}

interface ArchiveCalendarProps {
  items: ArchiveItem[]
}

// Full-width frictionless calendar archive
export function ArchiveCalendar({ items }: ArchiveCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const router = useRouter()

  // Calendar dates generation
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between brutal-border bg-foreground text-background p-4 sm:p-6">
        <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter italic">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-accent hover:text-accent-foreground brutal-border bg-background text-foreground transition-all">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-accent hover:text-accent-foreground brutal-border bg-background text-foreground transition-all">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="brutal-border brutal-shadow-lg overflow-hidden bg-card">
        <div className="grid grid-cols-7 border-b-4 border-foreground bg-accent text-accent-foreground">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 sm:p-4 text-center font-black uppercase text-xs sm:text-sm border-r-2 last:border-r-0 border-foreground/20">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 grid-rows-5 sm:grid-rows-6 min-h-[600px] sm:min-h-[800px]">
          {calendarDays.map((day, i) => {
            const dayItems = items.filter(item => isSameDay(new Date(item.date), day))
            const isCurrentMonth = isSameDay(startOfMonth(day), monthStart)
            
            return (
              <div 
                key={i} 
                className={cn(
                  "border-b-2 border-r-2 border-foreground/10 p-1 sm:p-2 flex flex-col gap-1 transition-colors relative group",
                  !isCurrentMonth ? "bg-muted/30 opacity-40" : "bg-card hover:bg-accent/5",
                  isToday(day) && "bg-accent/10"
                )}
              >
                <span className={cn(
                  "text-xs sm:text-sm font-black p-1 self-end",
                  isToday(day) ? "bg-accent text-accent-foreground" : "opacity-40"
                )}>
                  {format(day, 'd')}
                </span>

                <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px] sm:max-h-[120px] scrollbar-hide">
                  {dayItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.type === 'post' ? `/post/${item.slug}` : `/newsletter/archive/${item.slug}`}
                      className={cn(
                        "text-[9px] sm:text-[10px] p-1.5 leading-tight font-bold brutal-border-sm flex items-center gap-1 transition-all",
                        item.type === 'post' ? "bg-white text-black" : "bg-foreground text-background"
                      )}
                    >
                      <div className="shrink-0">
                        {item.type === 'post' ? <FileText size={10} /> : <Mail size={10} />}
                      </div>
                      <span className="line-clamp-2 uppercase">{item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 p-4 brutal-border bg-muted font-black uppercase text-[10px] sm:text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white brutal-border-sm" />
          <span>Blog Post</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-foreground brutal-border-sm" />
          <span>Newsletter Issue</span>
        </div>
        <div className="ml-auto italic opacity-60">
          Tip: Click any item to jump straight to it
        </div>
      </div>
    </div>
  )
}
