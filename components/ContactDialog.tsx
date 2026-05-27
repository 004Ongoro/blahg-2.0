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
      <DialogContent className="brutal-border brutal-shadow-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Get in touch</DialogTitle>
          <DialogDescription className="font-bold">
            Have a question or just want to say hi? Send me a message below.
          </DialogDescription>
        </DialogHeader>
        <ContactForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
