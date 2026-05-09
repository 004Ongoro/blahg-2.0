'use client'

import { useState } from 'react'
import { Share2, Twitter, Facebook, Linkedin, Link2, Send, MessageSquare } from 'lucide-react'
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
