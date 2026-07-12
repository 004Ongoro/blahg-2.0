import Link from 'next/link'

interface RelatedPost {
  title: string
  slug: string
}

interface MoreLikeThisProps {
  posts: RelatedPost[]
}

export function MoreLikeThis({ posts }: MoreLikeThisProps) {
  if (!posts || posts.length === 0) return null

  return (
    <div className="mb-16">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-6">
        More like this
      </h3>
      <ul className="flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link 
              href={`/post/${post.slug}`}
              className="group block"
            >
              <span className="text-lg font-bold group-hover:text-accent transition-colors leading-tight block">
                {post.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
