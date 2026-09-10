'use client'

import { PostCard } from '@/components/PostCard'

interface Post {
  _id: string
  title: string
  slug: string
  excerpt: string
  createdAt: string
  readTime: number
  tags: string[]
  series?: string
  authorName?: string
  isGuest?: boolean
  coverImage?: string
}

interface PostListProps {
  posts: Post[]
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="border border-dashed border-border p-12 text-center rounded-2xl bg-card/40">
        <p className="text-muted-foreground font-mono font-semibold uppercase tracking-wider text-xs">
          No articles published yet.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-2">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          title={post.title}
          slug={post.slug}
          excerpt={post.excerpt}
          createdAt={new Date(post.createdAt)}
          readTime={post.readTime}
          tags={post.tags}
          series={post.series}
          authorName={post.authorName}
          isGuest={post.isGuest}
          coverImage={post.coverImage}
        />
      ))}
    </div>
  )
}
