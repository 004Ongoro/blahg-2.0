'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { motion, useScroll, useSpring } from 'framer-motion' // Added for animations
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MarkdownContent } from '@/components/MarkdownContent'
import GiscusComments from '@/components/GiscusComments'
import { formatDate } from '@/lib/utils'
import { useEffect, useState } from 'react'

export const dynamic = 'force-static'
export const revalidate = false

interface Post {
  title: string
  content: string
  excerpt: string
  createdAt: string
  readTime: number
  tags: string[]
  slug: string
}

// Animation variants for section reveals
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  }
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  // Scroll Progress Logic
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${params.slug}`)
        if (res.ok) {
          const data = await res.json()
          setPost(data)
        }
      } catch (err) {
        console.error("Failed to load post", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [params.slug])

  if (loading) return <div className="min-h-screen bg-background" />
  if (!post) notFound()

  return (
    <div className="min-h-screen flex flex-col relative">
      {/*  Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-2 bg-accent z-[60] origin-left"
        style={{ scaleX }}
      />

      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <article>
          {/* Header Animation */}
          <motion.header 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mb-8"
          >
            <Link
              href="/"
              className="text-muted-foreground hover:text-accent text-sm mb-4 inline-block font-bold"
            >
              &larr; back to posts
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
              <span>{formatDate(new Date(post.createdAt))}</span>
              <span className="text-accent">|</span>
              <span>{post.readTime} min read</span>
            </div>
          </motion.header>

          {/* Content Body Animation */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="brutal-border brutal-shadow bg-card p-6 md:p-8 mb-8"
          >
            <MarkdownContent content={post.content} />
          </motion.div>

          {/* Comments Section Animation */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <GiscusComments />
          </motion.div>
        </article>
      </main>

      <Footer />
    </div>
  )
}