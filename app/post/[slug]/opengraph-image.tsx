import { ImageResponse } from 'next/og'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'

export const runtime = 'nodejs'

export const alt = 'George Ongoro Blog'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    await dbConnect()
    const post = await Post.findOne({ slug, published: true }).select('title tags readTime').lean()

    const title = post?.title || 'George Ongoro'
    const tags = (post?.tags as string[]) || []
    const readTime = post?.readTime

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
            backgroundColor: '#9ca3db',
            padding: '80px',
            border: '32px solid #677db7',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Background decoration */}
          <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, backgroundColor: '#677db7', transform: 'rotate(15deg)', opacity: 0.1 }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
              <div style={{ width: 120, height: 40, backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: 18, fontWeight: 900, textTransform: 'uppercase' }}>George.2.0</span>
              </div>
              <div style={{ height: 4, flexGrow: 1, backgroundColor: '#000' }} />
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

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', gap: 15 }}>
              {tags.slice(0, 3).map(tag => (
                <div key={tag} style={{ backgroundColor: '#677db7', padding: '10px 20px', border: '4px solid #000', display: 'flex' }}>
                  <span style={{ color: '#000', fontSize: 24, fontWeight: 900 }}>#{tag}</span>
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
        ...size,
      }
    )
  } catch (e: any) {
    return new ImageResponse(
      (
        <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
          <h1>George Ongoro</h1>
        </div>
      ),
      { ...size }
    )
  }
}
