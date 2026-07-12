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
}

interface PostListProps {
  posts: Post[]
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="border-2 border-dashed border-foreground/10 p-12 text-center rounded-lg">
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">no posts yet.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          title={post.title}
          slug={post.slug}
          excerpt={post.excerpt}
          createdAt={new Date(post.createdAt)}
          readTime={post.readTime}
          tags={post.tags}
        />
      ))}
    </div>
  )
}
