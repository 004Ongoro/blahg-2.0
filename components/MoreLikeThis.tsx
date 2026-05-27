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
    <div className="mb-12">
      <h3 className="font-black uppercase text-sm mb-4 tracking-wider flex items-center gap-2">
        <span className="text-accent">{'>'}</span> More Like This
      </h3>
      <ul className="flex flex-col gap-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link 
              href={`/post/${post.slug}`}
              className="group inline-flex items-center gap-2"
            >
              <span className="h-2 w-2 bg-accent group-hover:w-4 transition-all duration-300" />
              <span className="text-lg font-bold hover:text-accent underline decoration-2 decoration-transparent underline-offset-4 transition-all group-hover:decoration-accent">
                {post.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
