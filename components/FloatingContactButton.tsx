'use client'

import { useState } from 'react'
import { MessageSquareIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ContactForm } from '@/components/ContactForm'

export function FloatingContactButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-[100px] right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.1, rotate: -2 }}
          whileTap={{ scale: 0.9, rotate: 2 }}
          onClick={() => setIsOpen(true)}
          className="brutal-btn bg-accent text-accent-foreground p-4 flex items-center justify-center rounded-none"
          aria-label="Contact me"
        >
          <MessageSquareIcon className="size-6" />
        </motion.button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="brutal-border brutal-shadow-lg rounded-none sm:max-w-md bg-background p-0 overflow-hidden border-[3px]">
          <DialogHeader className="bg-primary text-primary-foreground p-6 border-b-[3px] border-primary">
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
