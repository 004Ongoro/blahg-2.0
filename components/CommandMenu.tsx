'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Search, FileText, Tag, Home, Mail, Shield, ArrowRight, Keyboard, Eye, MessageSquare, Sun, Moon, Monitor } from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const [posts, setPosts] = React.useState<any[]>([])
  const router = useRouter()
  const { setTheme } = useTheme()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  React.useEffect(() => {
    if (open && posts.length === 0) {
      fetch('/api/posts')
        .then((res) => res.json())
        .then((data) => setPosts(data))
        .catch((err) => console.error('Failed to fetch posts', err))
    }
  }, [open, posts.length])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <div className="fixed bottom-24 right-6 z-40">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 brutal-border brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_var(--foreground)] transition-all bg-accent text-accent-foreground"
              onClick={() => setOpen(true)}
            >
              <Keyboard className="h-6 w-6" />
              <span className="sr-only">Open Command Palette</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            command palette (⌘K)
          </TooltipContent>
        </Tooltip>
      </div>

      <CommandDialog 
        open={open} 
        onOpenChange={setOpen}
        className="brutal-border brutal-shadow rounded-none border-4 border-foreground"
      >
        <CommandInput 
          placeholder="Type a command or search posts..." 
          className="border-none focus:ring-0 text-lg py-6 font-bold uppercase"
        />
        <CommandList className="border-t-4 border-foreground p-2">
          <CommandEmpty className="font-bold py-10 uppercase text-muted-foreground">No results found.</CommandEmpty>
          
          <CommandGroup heading={<span className="font-black uppercase text-foreground px-2 pb-2 block border-b-2 border-foreground mb-2">Navigation</span>}>
            <CommandItem 
              onSelect={() => runCommand(() => router.push('/'))}
              className="font-bold uppercase py-3 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
            >
              <Home className="mr-3 h-5 w-5" />
              <span>Home / Posts</span>
            </CommandItem>
            <CommandItem 
              onSelect={() => runCommand(() => router.push('/tags'))}
              className="font-bold uppercase py-3 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
            >
              <Tag className="mr-3 h-5 w-5" />
              <span>Tags Archive</span>
            </CommandItem>
            <CommandItem 
              onSelect={() => runCommand(() => router.push('/guestbook'))}
              className="font-bold uppercase py-3 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
            >
              <MessageSquare className="mr-3 h-5 w-5" />
              <span>Guestbook</span>
            </CommandItem>
            <CommandItem 
              onSelect={() => runCommand(() => router.push('/newsletter'))}
              className="font-bold uppercase py-3 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
            >
              <Mail className="mr-3 h-5 w-5" />
              <span>Newsletter</span>
            </CommandItem>
            <CommandItem 
              onSelect={() => runCommand(() => router.push('/admin'))}
              className="font-bold uppercase py-3 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
            >
              <Shield className="mr-3 h-5 w-5" />
              <span>Admin Dashboard</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator className="bg-foreground h-1 my-2" />
          
          <CommandGroup heading={<span className="font-black uppercase text-foreground px-2 pb-2 block border-b-2 border-foreground mb-2">Theme</span>}>
            <CommandItem 
              onSelect={() => runCommand(() => setTheme('light'))}
              className="font-bold uppercase py-3 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
            >
              <Sun className="mr-3 h-5 w-5" />
              <span>Light Mode</span>
            </CommandItem>
            <CommandItem 
              onSelect={() => runCommand(() => setTheme('dark'))}
              className="font-bold uppercase py-3 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
            >
              <Moon className="mr-3 h-5 w-5" />
              <span>Dark Mode</span>
            </CommandItem>
            <CommandItem 
              onSelect={() => runCommand(() => setTheme('system'))}
              className="font-bold uppercase py-3 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
            >
              <Monitor className="mr-3 h-5 w-5" />
              <span>System Default</span>
            </CommandItem>
          </CommandGroup>

          {posts.length > 0 && (
            <>
              <CommandSeparator className="bg-foreground h-1 my-2" />
              <CommandGroup heading={<span className="font-black uppercase text-foreground px-2 pb-2 block border-b-2 border-foreground mb-2">Latest Posts</span>}>
                {posts.map((post) => (
                  <CommandItem
                    key={post.slug}
                    onSelect={() => runCommand(() => router.push(`/post/${post.slug}`))}
                    className="font-bold uppercase py-4 border-b border-foreground/10 last:border-none data-[selected=true]:bg-foreground data-[selected=true]:text-background"
                  >
                    <FileText className="mr-3 h-5 w-5 shrink-0" />
                    <div className="flex flex-col">
                      <span className="line-clamp-1">{post.title}</span>
                      <div className="flex gap-3 mt-1 items-center">
                        {post.tags && post.tags.length > 0 && (
                          <span className="text-[10px] opacity-70 flex gap-1">
                            {post.tags.map((t: string) => `#${t}`).join(' ')}
                          </span>
                        )}
                        {post.views > 100 && (
                          <span className="text-[10px] text-accent font-black uppercase tracking-tighter">
                            🔥 Trending
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 opacity-50" />
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
