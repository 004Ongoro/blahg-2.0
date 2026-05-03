'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { sendContactEmail } from '@/lib/actions'
import { toast } from 'sonner'

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
})

type ContactValues = z.infer<typeof contactSchema>

interface ContactFormProps {
  onSuccess?: () => void
}

export function ContactForm({ onSuccess }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactValues) => {
    setIsSubmitting(true)
    try {
      const result = await sendContactEmail(data)
      if (result.success) {
        toast.success('Message sent! I\'ll get back to you soon.')
        reset()
        if (onSuccess) onSuccess()
      } else {
        toast.error(result.error || 'Failed to send message.')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-1">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-bold uppercase tracking-wider">
          Name
        </label>
        <input
          id="name"
          {...register('name')}
          placeholder="your name"
          className="w-full brutal-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        {errors.name && (
          <p className="text-xs text-destructive font-bold">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-bold uppercase tracking-wider">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          placeholder="your@email.com"
          className="w-full brutal-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        {errors.email && (
          <p className="text-xs text-destructive font-bold">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-bold uppercase tracking-wider">
          Subject
        </label>
        <input
          id="subject"
          {...register('subject')}
          placeholder="what's this about?"
          className="w-full brutal-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        {errors.subject && (
          <p className="text-xs text-destructive font-bold">{errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-bold uppercase tracking-wider">
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          {...register('message')}
          placeholder="your message here..."
          className="w-full brutal-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
        />
        {errors.message && (
          <p className="text-xs text-destructive font-bold">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full brutal-btn bg-accent text-accent-foreground py-3 font-black uppercase tracking-tighter text-lg disabled:opacity-50 mt-2"
      >
        {isSubmitting ? 'sending...' : 'send message'}
      </button>
    </form>
  )
}
