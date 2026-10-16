import React from 'react'

export interface OgCardProps {
  title: string
  excerpt?: string
  tags?: string[]
  readTime?: string | number
  date?: string | Date
  authorName?: string
  authorRole?: string
  badgeText?: string
  siteName?: string
}

function truncateAtWord(text: string, maxLength: number): string {
  if (!text) return ''
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= maxLength) return clean
  const cut = clean.slice(0, maxLength)
  const lastSpace = cut.lastIndexOf(' ')
  if (lastSpace > maxLength * 0.75) {
    return cut.slice(0, lastSpace).trim() + '…'
  }
  return cut.trim() + '…'
}

function formatDisplayDate(date?: string | Date): string {
  if (!date) return ''
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return String(date)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

export function OgCard({
  title = 'George Ongoro Blog',
  excerpt = '',
  tags = [],
  readTime,
  date,
  authorName = 'George Ongoro',
  badgeText = 'ARTICLE',
  siteName = 'CODE.GEOHACK.TOP',
}: OgCardProps) {
  const rawTitle = (title || 'George Ongoro Blog').replace(/\s+/g, ' ').trim()
  const rawExcerpt = (excerpt || '').replace(/\s+/g, ' ').trim()

  const isLongTitle = rawTitle.length > 70
  const isMediumTitle = rawTitle.length > 40 && !isLongTitle

  let titleFontSize = 54
  let titleLineHeight = 1.16
  let maxExcerptLength = 160

  if (isLongTitle) {
    titleFontSize = 40
    titleLineHeight = 1.22
    maxExcerptLength = 120
  } else if (isMediumTitle) {
    titleFontSize = 48
    titleLineHeight = 1.18
    maxExcerptLength = 145
  } else if (!rawExcerpt) {
    titleFontSize = 62
    titleLineHeight = 1.14
  }

  const displayTitle = truncateAtWord(rawTitle, 110)
  const displayExcerpt = truncateAtWord(rawExcerpt, maxExcerptLength)
  const formattedDate = formatDisplayDate(date)
  const formattedReadTime = readTime
    ? typeof readTime === 'number' || !isNaN(Number(readTime))
      ? `${readTime} MIN READ`
      : String(readTime).toUpperCase()
    : ''

  const displayTags = tags.filter(Boolean).slice(0, 3)
  const isDefaultAuthor = !authorName || authorName.toLowerCase().includes('george')
  const authorHandle = isDefaultAuthor ? '@004Ongoro' : 'Guest Contributor'
  const authorInitials = (authorName || 'GO')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FAFAF9',
        position: 'relative',
        padding: '40px 48px',
        boxSizing: 'border-box',
        fontFamily: 'Space Grotesk, sans-serif',
      }}
    >
      {/* Delicate background ambient decoration (soft indigo/violet glow on pure light stone) */}
      <svg
        width="1200"
        height="630"
        viewBox="0 0 1200 630"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <defs>
          <radialGradient id="soft-indigo" cx="92%" cy="8%" r="50%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="soft-sky" cx="8%" cy="92%" r="45%">
            <stop offset="0%" stopColor="#0284C7" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
          </radialGradient>
          <pattern id="light-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1.2" fill="#0F172A" fillOpacity="0.05" />
          </pattern>
        </defs>

        <rect width="1200" height="630" fill="#FAFAF9" />
        <rect width="1200" height="630" fill="url(#light-grid)" />
        <rect width="1200" height="630" fill="url(#soft-indigo)" />
        <rect width="1200" height="630" fill="url(#soft-sky)" />
      </svg>

      {/* Main Lightweight Card */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '24px',
          padding: '40px 48px',
          boxSizing: 'border-box',
          position: 'relative',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.03)',
        }}
      >
        {/* Top vibrant indigo accent stripe */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '48px',
            right: '48px',
            height: '4px',
            background: 'linear-gradient(90deg, #4F46E5 0%, #3B82F6 50%, #06B6D4 100%)',
            borderRadius: '4px 4px 0 0',
          }}
        />

        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Site Branding & Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {/* Indigo pulse dot */}
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#4F46E5',
              }}
            />
            <span
              style={{
                color: '#0F172A',
                fontSize: '15px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {siteName}
            </span>
            <span
              style={{
                color: '#CBD5E1',
                fontSize: '16px',
                fontWeight: 400,
              }}
            >
              /
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '4px 12px',
                backgroundColor: '#EEF2FF',
                border: '1px solid #C7D2FE',
                borderRadius: '100px',
              }}
            >
              <span
                style={{
                  color: '#4338CA',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {badgeText}
              </span>
            </div>
          </div>

          {/* Tags Pills */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            {displayTags.map((tag) => (
              <div
                key={tag}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '5px 12px',
                  backgroundColor: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  borderRadius: '100px',
                }}
              >
                <span
                  style={{
                    color: '#475569',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase',
                  }}
                >
                  #{tag.replace(/^#/, '')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Section: Title & Excerpt */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flexGrow: 1,
            padding: '20px 0',
          }}
        >
          <h1
            style={{
              color: '#0F172A',
              fontSize: `${titleFontSize}px`,
              fontWeight: 700,
              lineHeight: titleLineHeight,
              letterSpacing: '-0.03em',
              margin: 0,
              wordBreak: 'break-word',
            }}
          >
            {displayTitle}
          </h1>

          {displayExcerpt ? (
            <p
              style={{
                color: '#475569',
                fontSize: isLongTitle ? '19px' : '22px',
                fontWeight: 500,
                lineHeight: 1.45,
                margin: '16px 0 0 0',
                wordBreak: 'break-word',
              }}
            >
              {displayExcerpt}
            </p>
          ) : null}
        </div>

        {/* Footer Bar */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #F1F5F9',
            paddingTop: '20px',
          }}
        >
          {/* Metadata: Date & Read Time */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            {formattedDate ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span
                  style={{
                    color: '#64748B',
                    fontSize: '14px',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {formattedDate}
                </span>
              </div>
            ) : null}

            {formattedDate && formattedReadTime ? (
              <span style={{ color: '#CBD5E1', fontSize: '14px' }}>•</span>
            ) : null}

            {formattedReadTime ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span
                  style={{
                    color: '#64748B',
                    fontSize: '14px',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                  }}
                >
                  {formattedReadTime}
                </span>
              </div>
            ) : null}
          </div>

          {/* Author Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#EEF2FF',
                border: '1.5px solid #C7D2FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  color: '#4338CA',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                {authorInitials}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span
                style={{
                  color: '#0F172A',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                {authorName}
              </span>
              <span
                style={{
                  color: '#64748B',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                {authorHandle}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
