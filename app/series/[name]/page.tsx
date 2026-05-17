import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PostList } from '@/components/PostList'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import { notFound } from 'next/navigation'
import { Layers } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-static'
export const revalidate = false

export async function generateStaticParams() {
  try {
    await dbConnect()
    const series = await Post.distinct('series', { published: true, series: { $ne: null } })
    return series.map((name: string) => ({
      name: encodeURIComponent(name),
    }))
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    return []
  }
}

interface Props {
  params: Promise<{ name: string }>
}

async function getSeriesPosts(seriesName: string) {
  await dbConnect()
  const posts = await Post.find({ 
    series: seriesName, 
    published: true 
  }).sort({ seriesOrder: 1, createdAt: 1 }).lean()
  
  return JSON.parse(JSON.stringify(posts))
}

export default async function SeriesDetailPage({ params }: Props) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)
  const posts = await getSeriesPosts(decodedName)

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="mb-8">
          <Link
            href="/series"
            className="text-muted-foreground hover:text-accent text-sm font-bold mb-4 block"
          >
            &larr; all series
          </Link>
          
          <h1 className="text-4xl font-black uppercase flex items-center gap-3">
            <Layers className="w-10 h-10 text-accent" />
            {decodedName}
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            A series of {posts.length} {posts.length === 1 ? 'article' : 'articles'}
          </p>
        </div>

        <section>
          <PostList posts={posts} />
        </section>
      </main>
      <Footer />
    </div>
  )
}
