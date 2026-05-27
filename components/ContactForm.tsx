'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { sendContactEmail } from '@/lib/actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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

  const inputClasses = "w-full bg-transparent border-b border-foreground/10 py-3 text-sm font-medium focus:border-accent outline-none placeholder:text-muted-foreground/20 transition-all"
  const labelClasses = "text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 block mb-1"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-1">
          <label htmlFor="name" className={labelClasses}>
            Your Identity
          </label>
          <input
            id="name"
            {...register('name')}
            placeholder="John Doe"
            className={inputClasses}
          />
          {errors.name && (
            <p className="text-[10px] text-destructive font-bold uppercase tracking-tighter pt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className={labelClasses}>
            Contact Frequency
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            placeholder="john@example.com"
            className={inputClasses}
          />
          {errors.email && (
            <p className="text-[10px] text-destructive font-bold uppercase tracking-tighter pt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="subject" className={labelClasses}>
          Subject Header
        </label>
        <input
          id="subject"
          {...register('subject')}
          placeholder="A briefly detailed inquiry"
          className={inputClasses}
        />
        {errors.subject && (
          <p className="text-[10px] text-destructive font-bold uppercase tracking-tighter pt-1">{errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="message" className={labelClasses}>
          The Full Content
        </label>
        <textarea
          id="message"
          rows={4}
          {...register('message')}
          placeholder="What's on your mind?"
          className={cn(inputClasses, "resize-none min-h-[120px]")}
        />
        {errors.message && (
          <p className="text-[10px] text-destructive font-bold uppercase tracking-tighter pt-1">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-foreground text-background py-4 font-black uppercase tracking-[0.2em] text-xs hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-50 mt-4 rounded-xl"
      >
        {isSubmitting ? 'Transmitting...' : 'Dispatch Message'}
      </button>
    </form>
  )
}
