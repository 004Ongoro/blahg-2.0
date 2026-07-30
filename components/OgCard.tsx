import React from 'react'

export interface OgCardProps {
  title: string
  tags?: string[]
  readTime?: string | number
  authorName?: string
  authorHandle?: string
  siteDomain?: string
}

export function OgCard({
  title = 'George Ongoro Blog',
  tags = [],
  readTime,
  authorName = 'George Ongoro',
  authorHandle = '@004Ongoro',
  siteDomain = 'georgeongoro.dev',
}: OgCardProps) {
  // Truncate title if extremely long to keep it lightweight, readable & balanced
  const rawTitle = title || 'George Ongoro Blog'
  const displayTitle = rawTitle.length > 90 ? rawTitle.slice(0, 87) + '...' : rawTitle

  // Dynamic font size calculation based on title length
  let titleFontSize = '56px'
  if (displayTitle.length > 70) {
    titleFontSize = '36px'
  } else if (displayTitle.length > 45) {
    titleFontSize = '44px'
  } else if (displayTitle.length > 25) {
    titleFontSize = '50px'
  }

  // Process and clean tags (max 3, truncated if > 15 chars)
  const processedTags = tags
    .filter(Boolean)
    .slice(0, 3)
    .map((tag) => (tag.length > 15 ? tag.slice(0, 14) + '…' : tag))

  // Format read time string
  const formattedReadTime = readTime
    ? typeof readTime === 'number' || !isNaN(Number(readTime))
      ? `${readTime} MIN READ`
      : String(readTime).toUpperCase()
    : null

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#070a12',
        position: 'relative',
        padding: '36px',
        boxSizing: 'border-box',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Developer Grid Pattern & Ambient Glows */}
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
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" strokeOpacity="0.4" />
          </pattern>
          <radialGradient id="glow-top-right" cx="85%" cy="15%" r="55%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#070a12" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-bottom-left" cx="15%" cy="85%" r="55%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#070a12" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1200" height="630" fill="#070a12" />
        <rect width="1200" height="630" fill="url(#grid-pattern)" />
        <rect width="1200" height="630" fill="url(#glow-top-right)" />
        <rect width="1200" height="630" fill="url(#glow-bottom-left)" />
      </svg>

      {/* Main IDE Window Frame */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#0f172a',
          borderRadius: '16px',
          border: '1.5px solid #1e293b',
          boxSizing: 'border-box',
          padding: '28px 36px',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* Top Header Bar: Traffic light controls + breadcrumb + badge */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #1e293b',
            paddingBottom: '20px',
          }}
        >
          {/* Controls + Prompt */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#eab308' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#1e293b',
                padding: '6px 14px',
                borderRadius: '6px',
                border: '1px solid #334155',
                gap: '8px',
              }}
            >
              <span style={{ color: '#38bdf8', fontSize: '15px', fontWeight: 700, fontFamily: 'monospace' }}>
                ~/
              </span>
              <span style={{ color: '#94a3b8', fontSize: '15px', fontWeight: 600, fontFamily: 'monospace' }}>
                {siteDomain} / blog
              </span>
            </div>
          </div>

          {/* Module Pill */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#0c4a6e',
                border: '1px solid #0284c7',
                borderRadius: '20px',
                padding: '5px 14px',
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38bdf8' }} />
              <span
                style={{
                  color: '#e0f2fe',
                  fontSize: '13px',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  fontFamily: 'monospace',
                }}
              >
                GEORGE.2.0
              </span>
            </div>
          </div>
        </div>

        {/* Center Main Content: Syntax indicator & Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            justifyContent: 'center',
            padding: '20px 0',
          }}
        >
          {/* Syntax marker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{ color: '#38bdf8', fontSize: '15px', fontWeight: 700, fontFamily: 'monospace' }}>
              const
            </span>
            <span style={{ color: '#a7f3d0', fontSize: '15px', fontWeight: 700, fontFamily: 'monospace' }}>
              article
            </span>
            <span style={{ color: '#94a3b8', fontSize: '15px', fontWeight: 600, fontFamily: 'monospace' }}>
              =
            </span>
            <span style={{ color: '#cbd5e1', fontSize: '15px', fontWeight: 500, fontFamily: 'monospace' }}>
              {`{ title }`}
            </span>
          </div>

          {/* Title Area with Left Accent Gradient Line */}
          <div
            style={{
              display: 'flex',
              alignItems: 'stretch',
              gap: '20px',
            }}
          >
            <div
              style={{
                width: '6px',
                borderRadius: '4px',
                backgroundColor: '#38bdf8',
                backgroundImage: 'linear-gradient(to bottom, #38bdf8, #8b5cf6)',
                flexShrink: 0,
              }}
            />

            <h1
              style={{
                fontSize: titleFontSize,
                fontWeight: 800,
                color: '#f8fafc',
                lineHeight: 1.18,
                margin: 0,
                letterSpacing: '-0.02em',
                wordBreak: 'break-word',
              }}
            >
              {displayTitle}
            </h1>
          </div>
        </div>

        {/* Footer Bar: Tags, Read Time & Author Profile */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #1e293b',
            paddingTop: '20px',
          }}
        >
          {/* Left: Tags & Read Time */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {processedTags.length > 0 ? (
              processedTags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    backgroundColor: '#1e293b',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid #334155',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      color: '#38bdf8',
                      fontSize: '14px',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                    }}
                  >
                    #{tag.toLowerCase()}
                  </span>
                </div>
              ))
            ) : (
              <div
                style={{
                  backgroundColor: '#1e293b',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid #334155',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    color: '#38bdf8',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                  }}
                >
                  #dev
                </span>
              </div>
            )}

            {formattedReadTime && (
              <div
                style={{
                  backgroundColor: '#2e1065',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid #5b21b6',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    color: '#c084fc',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                  }}
                >
                  ⚡ {formattedReadTime}
                </span>
              </div>
            )}
          </div>

          {/* Right: Author Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#0284c7',
                backgroundImage: 'linear-gradient(135deg, #0284c7, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #38bdf8',
              }}
            >
              <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 800 }}>GO</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#f8fafc', fontSize: '15px', fontWeight: 700 }}>{authorName}</span>
              <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 600, fontFamily: 'monospace' }}>
                {authorHandle}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
