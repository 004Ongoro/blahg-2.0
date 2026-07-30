import React from 'react'

export function getEmoteForTitle(title: string): string {
  if (!title) return '⚡'
  const t = title.toLowerCase()
  if (t.includes('code') || t.includes('dev') || t.includes('program') || t.includes('script') || t.includes('ts') || t.includes('js') || t.includes('type')) return '💻'
  if (t.includes('fast') || t.includes('speed') || t.includes('performance') || t.includes('edge')) return '⚡'
  if (t.includes('ai') || t.includes('agent') || t.includes('model') || t.includes('llm') || t.includes('prompt')) return '🤖'
  if (t.includes('arch') || t.includes('build') || t.includes('design') || t.includes('system') || t.includes('clean')) return '🛠️'
  if (t.includes('guide') || t.includes('tip') || t.includes('learn') || t.includes('how')) return '💡'
  if (t.includes('fire') || t.includes('hot') || t.includes('awesome') || t.includes('best') || t.includes('top')) return '🔥'
  if (t.includes('security') || t.includes('auth') || t.includes('lock') || t.includes('crypto')) return '🛡️'
  if (t.includes('data') || t.includes('mongo') || t.includes('db') || t.includes('sql') || t.includes('store')) return '📦'
  if (t.includes('rocket') || t.includes('launch') || t.includes('next') || t.includes('deploy') || t.includes('future')) return '🚀'

  const emotes = ['⚡', '🚀', '💡', '🛠️', '💻', '🔥', '🎯', '✨', '⚙️', '📦', '🎨', '🛡️']
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    hash = (hash << 5) - hash + title.charCodeAt(i)
    hash |= 0
  }
  return emotes[Math.abs(hash) % emotes.length]
}

export interface OgCardProps {
  title: string
  tags?: string[]
  readTime?: string | number
  authorName?: string
}

export function OgCard({
  title = 'Ongoro Blog',
  tags = [],
  readTime,
  authorName = 'George Ongoro',
}: OgCardProps) {
  const rawTitle = title || 'Ongoro Blog'

  // Truncate long titles gracefully
  const displayTitle = rawTitle.length > 80 ? rawTitle.slice(0, 77) + '...' : rawTitle
  const emote = getEmoteForTitle(rawTitle)

  // Dynamic font size adjustment based on title length
  let fontSize = '58px'
  if (displayTitle.length > 60) {
    fontSize = '38px'
  } else if (displayTitle.length > 35) {
    fontSize = '46px'
  }

  // Clean and process max 3 tags (truncated if > 14 characters)
  const processedTags = tags
    .filter(Boolean)
    .slice(0, 3)
    .map((tag) => (tag.length > 14 ? tag.slice(0, 13) + '…' : tag))

  const formattedReadTime = readTime
    ? typeof readTime === 'number' || !isNaN(Number(readTime))
      ? `${readTime} MIN READ`
      : String(readTime).toUpperCase()
    : '3 MIN READ'

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#efd6ac', // Wheat
        border: '12px solid #04151f', // Ink Black
        fontFamily: 'monospace, system-ui, sans-serif',
        padding: '36px',
        boxSizing: 'border-box',
        justifyContent: 'space-between',
        position: 'relative',
      }}
    >
      {/* Background Neo-Brutalist Grid Pattern */}
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
          opacity: 0.12,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <pattern id="brutalist-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#04151f" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="1200" height="630" fill="url(#brutalist-grid)" />
      </svg>

      {/* Header Bar: Site Name & Emote / Read Time */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '6px solid #04151f',
          paddingBottom: '24px',
        }}
      >
        {/* Site Name Badge */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#04151f',
            padding: '10px 22px',
            border: '4px solid #04151f',
            boxShadow: '5px 5px 0px #c44900',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              color: '#efd6ac',
              fontSize: '26px',
              fontWeight: 900,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            ONGORO BLOG
          </span>
        </div>

        {/* Emote + Readtime Badge */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          {/* Title Emote */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#432534', // Midnight Violet
              padding: '8px 16px',
              border: '4px solid #04151f',
              boxShadow: '4px 4px 0px #04151f',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '28px' }}>{emote}</span>
          </div>

          {/* Read Time */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#183a37', // Dark Slate Grey
              padding: '10px 20px',
              border: '4px solid #04151f',
              boxShadow: '4px 4px 0px #04151f',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                color: '#efd6ac',
                fontSize: '20px',
                fontWeight: 900,
                letterSpacing: '0.05em',
              }}
            >
              ⏱️ {formattedReadTime}
            </span>
          </div>
        </div>
      </div>

      {/* Main Title Area */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          justifyContent: 'center',
          padding: '24px 0',
        }}
      >
        <div
          style={{
            display: 'flex',
            backgroundColor: '#04151f',
            color: '#efd6ac',
            padding: '24px 32px',
            border: '6px solid #04151f',
            boxShadow: '10px 10px 0px #c44900', // Burnt Orange
          }}
        >
          <h1
            style={{
              fontSize: fontSize,
              fontWeight: 900,
              color: '#efd6ac',
              lineHeight: 1.15,
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              wordBreak: 'break-word',
            }}
          >
            {displayTitle}
          </h1>
        </div>
      </div>

      {/* Footer Bar: 3 Tags & Author */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '6px solid #04151f',
          paddingTop: '24px',
        }}
      >
        {/* Left: Up to 3 Tags */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {processedTags.length > 0 ? (
            processedTags.map((tag) => (
              <div
                key={tag}
                style={{
                  backgroundColor: '#c44900', // Burnt Orange
                  padding: '8px 18px',
                  border: '4px solid #04151f',
                  boxShadow: '4px 4px 0px #04151f',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    color: '#efd6ac',
                    fontSize: '18px',
                    fontWeight: 900,
                  }}
                >
                  #{tag.toUpperCase()}
                </span>
              </div>
            ))
          ) : (
            <div
              style={{
                backgroundColor: '#c44900',
                padding: '8px 18px',
                border: '4px solid #04151f',
                boxShadow: '4px 4px 0px #04151f',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  color: '#efd6ac',
                  fontSize: '18px',
                  fontWeight: 900,
                }}
              >
                #TECH
              </span>
            </div>
          )}
        </div>

        {/* Right: Author */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#183a37', // Dark Slate Grey
            padding: '8px 20px',
            border: '4px solid #04151f',
            boxShadow: '4px 4px 0px #04151f',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              color: '#efd6ac',
              fontSize: '18px',
              fontWeight: 900,
              letterSpacing: '0.05em',
            }}
          >
            BY {authorName.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  )
}
