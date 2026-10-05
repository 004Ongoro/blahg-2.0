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
  badgeText = 'TECHNICAL ARTICLE',
  siteName = 'CODE.GEOHACK.TOP',
}: OgCardProps) {
  const rawTitle = (title || 'George Ongoro Blog').replace(/\s+/g, ' ').trim()
  const rawExcerpt = (excerpt || '').replace(/\s+/g, ' ').trim()

  const isLongTitle = rawTitle.length > 80
  const isMediumTitle = rawTitle.length > 45 && !isLongTitle

  let titleFontSize = 54
  let titleLineHeight = 1.16
  let maxExcerptLength = 175

  if (isLongTitle) {
    titleFontSize = 38
    titleLineHeight = 1.22
    maxExcerptLength = 130
  } else if (isMediumTitle) {
    titleFontSize = 46
    titleLineHeight = 1.18
    maxExcerptLength = 155
  } else if (!rawExcerpt) {
    titleFontSize = 60
    titleLineHeight = 1.15
  }

  const displayTitle = truncateAtWord(rawTitle, 115)
  const displayExcerpt = truncateAtWord(rawExcerpt, maxExcerptLength)
  const formattedDate = formatDisplayDate(date)
  const formattedReadTime = readTime
    ? typeof readTime === 'number' || !isNaN(Number(readTime))
      ? `${readTime} MIN READ`
      : String(readTime).toUpperCase()
    : ''

  const displayTags = tags.filter(Boolean).slice(0, 2)
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
        backgroundColor: '#090D16',
        position: 'relative',
        padding: '32px',
        boxSizing: 'border-box',
        fontFamily: 'Space Grotesk, sans-serif',
      }}
    >
      {/* Background SVG with subtle ambient lighting & non-interfering creative geometric pattern */}
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
          {/* Ambient glow 1: warm amber accent */}
          <radialGradient id="amber-glow" cx="85%" cy="15%" r="45%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>

          {/* Ambient glow 2: cool indigo/cyan accent */}
          <radialGradient id="cyan-glow" cx="15%" cy="85%" r="40%">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
          </radialGradient>

          {/* Creative, delicate dot-matrix and micro-cross pattern */}
          <pattern id="grid-pattern" width="36" height="36" patternUnits="userSpaceOnUse">
            <circle cx="18" cy="18" r="1.2" fill="#94A3B8" fillOpacity="0.32" />
            <path
              d="M 36 0 L 36 3 M 0 36 L 3 36"
              stroke="#94A3B8"
              strokeWidth="0.8"
              strokeOpacity="0.18"
            />
          </pattern>
        </defs>

        {/* Base dark canvas */}
        <rect width="1200" height="630" fill="#090D16" />

        {/* Geometric pattern texture */}
        <rect width="1200" height="630" fill="url(#grid-pattern)" opacity="0.45" />

        {/* Ambient radial lighting overlays */}
        <rect width="1200" height="630" fill="url(#amber-glow)" />
        <rect width="1200" height="630" fill="url(#cyan-glow)" />

        {/* Subtle decorative canvas corner crosshairs */}
        <g stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.3">
          <path d="M 16 16 L 24 16 M 20 12 L 20 20" />
          <path d="M 1176 16 L 1184 16 M 1180 12 L 1180 20" />
          <path d="M 16 614 L 24 614 M 20 610 L 20 618" />
          <path d="M 1176 614 L 1184 614 M 1180 610 L 1180 618" />
        </g>
      </svg>

      {/* Main Glassmorphism Content Card */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.72)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          padding: '40px 48px',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Top vibrant gradient highlight bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '48px',
            right: '48px',
            height: '3px',
            background: 'linear-gradient(90deg, #F59E0B 0%, #EA580C 40%, rgba(234, 88, 12, 0) 100%)',
            borderRadius: '3px 3px 0 0',
          }}
        />

        {/* Header Bar: Brand Identity & Tags */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Brand & Badge Type */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {/* Glowing amber status dot */}
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#F59E0B',
                boxShadow: '0 0 10px #F59E0B',
              }}
            />
            <span
              style={{
                color: '#F1F5F9',
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
                color: 'rgba(255, 255, 255, 0.25)',
                fontSize: '16px',
                fontWeight: 400,
              }}
            >
              /
            </span>
            <span
              style={{
                color: '#94A3B8',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {badgeText}
            </span>
          </div>

          {/* Tags Pills (Right) */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            {displayTags.map((tag) => (
              <div
                key={tag}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 14px',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '100px',
                }}
              >
                <span
                  style={{
                    color: '#FBBF24',
                    fontSize: '13px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  #{tag.replace(/^#/, '')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Section: Post Title & Excerpt */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flexGrow: 1,
            padding: '24px 0',
          }}
        >
          {/* Post Title */}
          <h1
            style={{
              color: '#FFFFFF',
              fontSize: `${titleFontSize}px`,
              fontWeight: 700,
              lineHeight: titleLineHeight,
              letterSpacing: '-0.025em',
              margin: 0,
              wordBreak: 'break-word',
            }}
          >
            {displayTitle}
          </h1>

          {/* Post Excerpt (if provided) */}
          {displayExcerpt ? (
            <p
              style={{
                color: '#94A3B8',
                fontSize: isLongTitle ? '19px' : '22px',
                fontWeight: 500,
                lineHeight: 1.45,
                margin: '18px 0 0 0',
                wordBreak: 'break-word',
              }}
            >
              {displayExcerpt}
            </p>
          ) : null}
        </div>

        {/* Footer Bar: Metadata (Date/Read Time) & Author Profile */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '20px',
          }}
        >
          {/* Metadata Section (Date & Read Time) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            {/* Publication Date */}
            {formattedDate ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F59E0B"
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
                    color: '#CBD5E1',
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

            {/* Separator Bullet */}
            {formattedDate && formattedReadTime ? (
              <span style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '14px' }}>•</span>
            ) : null}

            {/* Read Time */}
            {formattedReadTime ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span
                  style={{
                    color: '#CBD5E1',
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

          {/* Author Profile (Right) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {/* Stylized Initial Badge */}
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                border: '1.5px solid rgba(245, 158, 11, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  color: '#FBBF24',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                {authorInitials}
              </span>
            </div>

            {/* Author Name and Handle */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span
                style={{
                  color: '#F1F5F9',
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
