'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Shuffle } from 'lucide-react'

interface LuckyButtonProps {
  allSlugs: string[]
  currentSlug: string
}

export function LuckyButton({ allSlugs, currentSlug }: LuckyButtonProps) {
  const router = useRouter()

  const handleLuckyClick = () => {
    // Filter out the current post so we don't "randomly" pick the one we're on
    const otherSlugs = allSlugs.filter(slug => slug !== currentSlug)
    const targetSlugs = otherSlugs.length > 0 ? otherSlugs : allSlugs
    
    const randomSlug = targetSlugs[Math.floor(Math.random() * targetSlugs.length)]
    if (randomSlug) {
      router.push(`/post/${randomSlug}`)
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleLuckyClick}
      className="w-full brutal-border brutal-shadow hover:bg-accent hover:text-white font-bold h-12"
    >
      <Shuffle className="mr-2 h-4 w-4" /> I'm Feeling Lucky
    </Button>
  )
}
