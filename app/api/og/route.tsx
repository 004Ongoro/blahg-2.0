import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'George Ongoro Blog'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: 'white',
            padding: '80px',
            border: '20px solid #fb923c',
          }}
        >
          {/* Decorative Shape */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              right: '40px',
              width: '100px',
              height: '100px',
              backgroundColor: '#fb923c',
              borderRadius: '0',
              transform: 'rotate(15deg)',
            }}
          />
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 32, fontWeight: 'bold', color: '#666', marginBottom: 0 }}>
              dev.blog / George Ongoro
            </p>
            <h1
              style={{
                fontSize: 84,
                fontWeight: 'black',
                color: '#fb923c',
                lineHeight: 1.1,
                marginTop: 20,
              }}
            >
              {title}
            </h1>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    return new Response(`Failed to generate image`, { status: 500 })
  }
}