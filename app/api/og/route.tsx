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
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#fffef5',
            padding: '80px',
            border: '32px solid #000',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Background decoration */}
          <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, backgroundColor: '#fb923c', transform: 'rotate(15deg)', opacity: 0.1 }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
              <div style={{ width: 120, height: 40, backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: 18, fontWeight: 900, textTransform: 'uppercase' }}>George.2.0</span>
              </div>
              <div style={{ height: 4, flexGrow: 1, backgroundColor: '#000' }} />
            </div>

            <h1
              style={{
                fontSize: 84,
                fontWeight: 900,
                color: '#000',
                lineHeight: 1,
                textTransform: 'uppercase',
                margin: 0,
                letterSpacing: '-0.04em',
              }}
            >
              {title}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', gap: 15 }}>
              {tags.slice(0, 3).map(tag => (
                <div key={tag} style={{ backgroundColor: '#fb923c', padding: '10px 20px', border: '4px solid #000', display: 'flex' }}>
                  <span style={{ color: '#000', fontSize: 24, fontWeight: 900 }}>#{tag}</span>
                </div>
              ))}
            </div>
            
            {readTime && (
              <div style={{ backgroundColor: '#000', padding: '10px 20px', display: 'flex' }}>
                <span style={{ color: '#fff', fontSize: 24, fontWeight: 900, textTransform: 'uppercase' }}>{readTime} MIN READ</span>
              </div>
            )}
          </div>
          
          {/* Brutalist Shadow Effect */}
          <div style={{ position: 'absolute', bottom: 40, right: 40, width: 200, height: 10, backgroundColor: '#000', opacity: 0.2 }} />
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