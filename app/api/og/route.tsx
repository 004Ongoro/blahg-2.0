import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'George Ongoro'
    const tags = searchParams.get('tags')?.split(',') || []
    const readTime = searchParams.get('readTime')

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#efd6ac', // Wheat
            border: '12px solid #04151f', // Ink Black
            fontFamily: 'monospace',
            padding: '40px',
            boxSizing: 'border-box',
            justifyContent: 'space-between',
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '6px solid #04151f',
              paddingBottom: '30px',
            }}
          >
            <div
              style={{
                display: 'flex',
                backgroundColor: '#04151f',
                padding: '10px 20px',
                border: '4px solid #04151f',
              }}
            >
              <span
                style={{
                  color: '#efd6ac',
                  fontSize: '24px',
                  fontWeight: 900,
                  letterSpacing: '0.1em',
                }}
              >
                GEORGE.2.0
              </span>
            </div>
            
            <div
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  color: '#183a37',
                  fontSize: '20px',
                  fontWeight: 900,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                SYSTEM MODULE // BLOG
              </span>
            </div>
          </div>

          {/* Main Title Area */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              justifyContent: 'center',
              padding: '40px 0',
            }}
          >
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 900,
                color: '#04151f',
                lineHeight: 1.1,
                textTransform: 'uppercase',
                margin: 0,
                letterSpacing: '-0.03em',
              }}
            >
              {title}
            </h1>
          </div>

          {/* Footer Bar */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '6px solid #04151f',
              paddingTop: '30px',
            }}
          >
            <div style={{ display: 'flex', gap: '15px' }}>
              {tags.slice(0, 3).map((tag) => (
                <div
                  key={tag}
                  style={{
                    backgroundColor: '#c44900',
                    padding: '8px 16px',
                    border: '4px solid #04151f',
                    boxShadow: '4px 4px 0px #04151f',
                    display: 'flex',
                  }}
                >
                  <span
                    style={{
                      color: '#efd6ac',
                      fontSize: '20px',
                      fontWeight: 900,
                    }}
                  >
                    #{tag.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>

            {readTime && (
              <div
                style={{
                  backgroundColor: '#183a37',
                  padding: '8px 20px',
                  border: '4px solid #04151f',
                  boxShadow: '4px 4px 0px #04151f',
                  display: 'flex',
                }}
              >
                <span
                  style={{
                    color: '#efd6ac',
                    fontSize: '20px',
                    fontWeight: 900,
                  }}
                >
                  {readTime} MIN READ
                </span>
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      }
    )
  } catch (e: any) {
    return new Response(`Failed to generate image`, { status: 500 })
  }
}