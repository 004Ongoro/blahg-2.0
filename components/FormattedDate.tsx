'use client'

import { useEffect, useState } from 'react'
import { formatDate, formatDateRelative } from '@/lib/utils'

interface FormattedDateProps {
  date: Date | string
  relative?: boolean
  className?: string
}

export function FormattedDate({ date, relative = true, className }: FormattedDateProps) {
  const [formatted, setFormatted] = useState<string>(formatDate(date))

  useEffect(() => {
    if (relative) {
      setFormatted(formatDateRelative(date))
    } else {
      setFormatted(formatDate(date))
    }
  }, [date, relative])

  return <span className={className}>{formatted}</span>
}
