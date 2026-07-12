'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ContactForm } from './ContactForm'

interface ContactDialogProps {
  trigger: React.ReactNode
}

export function ContactDialog({ trigger }: ContactDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl border-foreground/5 bg-background/95 backdrop-blur-2xl rounded-3xl p-8">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-3xl font-black uppercase tracking-tighter leading-none">
            Get in <span className="text-accent italic">Touch</span>
          </DialogTitle>
          <DialogDescription className="font-medium text-muted-foreground/60">
            Have a question or just want to say hi? Send me a message below.
          </DialogDescription>
        </DialogHeader>
        <ContactForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
