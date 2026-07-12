'use client'

import { useState } from 'react'
import { MessageSquareIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ContactForm } from '@/components/ContactForm'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function FloatingContactButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-[100px] right-6 z-40">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsOpen(true)}
              className="brutal-btn bg-accent text-accent-foreground p-4 flex items-center justify-center transition-transform hover:scale-105"
              aria-label="Contact me"
            >
              <MessageSquareIcon className="size-6" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">
            send me a message
          </TooltipContent>
        </Tooltip>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="brutal-border brutal-shadow-lg sm:max-w-md bg-background p-0 overflow-hidden">
          <DialogHeader className="bg-primary text-primary-foreground p-6 border-b border-primary">
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
              <span className="text-accent">{'>'}</span> drop me a line
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/80 font-bold">
              have a question or just want to say hi? i'm all ears.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <ContactForm onSuccess={() => setIsOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
