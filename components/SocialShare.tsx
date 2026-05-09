'use client'

import { useState } from 'react'
import { Share2, Twitter, Facebook, Linkedin, Link2, Send, MessageSquare } from 'lucide-react'

// Daily.dev icon component
const DailyDevIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 256 256" 
    className={className}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="256" height="256" rx="60" fill="#5222D0"/>
    <path d="M174.5 140.5V83C174.5 73.0589 166.441 65 156.5 65H134.5V140.5C134.5 150.441 142.559 158.5 152.5 158.5H156.5C166.441 158.5 174.5 150.441 174.5 140.5Z" fill="white"/>
    <path d="M81.5 140.5V118C81.5 108.059 89.5589 100 99.5 100H121.5V175.5C121.5 185.441 113.441 193.5 103.5 193.5H99.5C89.5589 193.5 81.5 185.441 81.5 175.5V140.5Z" fill="white"/>
  </svg>
)

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface SocialShareProps {
  title: string
  slug: string
}

// Social share component
export function SocialShare({ title, slug }: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false)
  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/post/${slug}`

  const shareLinks = [
    {
      name: 'X (Twitter)',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: 'Bluesky',
      icon: MessageSquare,
      href: `https://bsky.app/intent/compose?text=${encodeURIComponent(title + ' ' + url)}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: 'daily.dev',
      icon: DailyDevIcon,
      href: `https://app.daily.dev/posts/new?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: 'Mastodon',
      icon: Send,
      href: `https://mastodonshare.com/?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
  ]

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!')
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="brutal-border brutal-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_var(--foreground)] transition-all font-bold gap-2"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="brutal-border brutal-shadow rounded-none w-48 font-bold">
        {shareLinks.map((link) => (
          <DropdownMenuItem key={link.name} asChild className="cursor-pointer focus:bg-accent focus:text-accent-foreground">
            <a href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full">
              <link.icon className="w-4 h-4" />
              <span>{link.name}</span>
            </a>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer focus:bg-accent focus:text-accent-foreground border-t-2 border-foreground mt-1 pt-2">
          <div className="flex items-center gap-3">
            <Link2 className="w-4 h-4" />
            <span>Copy Link</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
