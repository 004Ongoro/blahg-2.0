'use client'

import * as React from 'react'
import { Calendar } from '@/components/ui/calendar'
import { useRouter } from 'next/navigation'
import { format, isSameDay } from 'date-fns'
import { cn } from '@/lib/utils'
import { FileText, Mail, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

// Calendar archive component
export function ArchiveCalendar({ items }: ArchiveCalendarProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date())
  const router = useRouter()

  const itemsOnSelectedDate = items.filter((item) => 
    selectedDate && isSameDay(new Date(item.date), selectedDate)
  )

  const modifiers = {
    hasContent: (date: Date) => items.some((item) => isSameDay(new Date(item.date), date)),
  }

  const modifiersStyles = {
    hasContent: {
      fontWeight: 'bold',
      border: '2px solid var(--accent)',
    },
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="brutal-border brutal-shadow bg-card p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="w-full"
          classNames={{
            month: "w-full space-y-4",
            table: "w-full h-full",
            head_row: "flex w-full",
            head_cell: "flex-1 font-black uppercase text-xs",
            row: "flex w-full mt-2",
            cell: "flex-1 h-12 md:h-16 relative p-0 hover:bg-accent/10 transition-colors",
            day: "w-full h-full p-0 font-bold",
          }}
          components={{
            DayButton: ({ day, modifiers, ...props }: any) => {
              const hasItem = items.some(item => isSameDay(new Date(item.date), day.date))
              const isToday = isSameDay(day.date, new Date())
              const isSelected = selectedDate && isSameDay(day.date, selectedDate)

              return (
                <button
                  {...props}
                  className={cn(
                    "w-full h-full flex flex-col items-center justify-center gap-1 transition-all relative",
                    isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/20",
                    isToday && !isSelected && "text-accent border-2 border-accent/30"
                  )}
                >
                  <span className="text-sm md:text-base">{format(day.date, 'd')}</span>
                  {hasItem && (
                    <div className="flex gap-0.5">
                      {items.filter(item => isSameDay(new Date(item.date), day.date)).map((item, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            item.type === 'post' ? "bg-foreground" : "bg-white border border-foreground"
                          )} 
                        />
                      ))}
                    </div>
                  )}
                </button>
              )
            }
          }}
        />
      </div>

      <div className="space-y-4 h-full flex flex-col">
        <div className="brutal-border bg-foreground text-background p-4">
          <h3 className="font-black uppercase tracking-tighter text-xl">
            {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
          </h3>
        </div>

        <div className="flex-1 space-y-4">
          <AnimatePresence mode="wait">
            {itemsOnSelectedDate.length > 0 ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {itemsOnSelectedDate.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.type === 'post' ? `/post/${item.slug}` : `/newsletter/archive/${item.slug}`)}
                    className="w-full brutal-border brutal-shadow bg-card p-4 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_var(--foreground)] transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-accent text-accent-foreground p-2 brutal-border-sm">
                        {item.type === 'post' ? <FileText size={20} /> : <Mail size={20} />}
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] font-black uppercase opacity-60 block">
                          {item.type}
                        </span>
                        <h4 className="font-bold group-hover:text-accent transition-colors">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                    <ChevronRight className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="brutal-border border-dashed p-12 text-center h-full flex flex-col items-center justify-center text-muted-foreground"
              >
                <p className="font-bold italic uppercase">Nothing published on this day</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="brutal-border p-4 bg-muted text-[10px] font-black uppercase flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-foreground" />
            <span>Blog Post</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white border border-foreground" />
            <span>Newsletter</span>
          </div>
        </div>
      </div>
    </div>
  )
}
