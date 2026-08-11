import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { blogPosts, getPost } from "@/lib/blog-posts"
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll"

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      siteName: "Nisa Dental & Surgical",
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Nisa Dental & Surgical" },
    publisher: { "@type": "Organization", name: "Nisa Dental & Surgical" },
  }

  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <AnimateOnScroll>
      <article className="max-w-2xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-1 text-primary text-caption font-bold uppercase tracking-wider mb-8 hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span> All Articles
        </Link>

        <div className="flex items-center gap-3 text-caption text-on-surface-variant mb-4">
          <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[11px]">{post.category}</span>
          <span>{post.date}</span>
          <span>· {post.readMinutes} min read</span>
        </div>

        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-8">{post.title}</h1>

        <div className="bg-surface-container-low rounded-xl border border-outline-variant/30 p-8 md:p-10">
          {post.content.map((para, i) => (
            <p key={i} className={i > 0 ? "text-body-lg text-on-surface-variant mb-6 leading-relaxed" : "text-body-lg text-on-surface-variant leading-relaxed"}>
              {para}
            </p>
          ))}
        </div>

        <div className="mt-12 bg-primary rounded-2xl p-8 md:p-10 text-center text-on-primary">
          <h2 className="font-headline-md text-headline-md mb-3">Need a dentist in Sialkot?</h2>
          <p className="text-on-primary/80 mb-6">Book a consultation with our team today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/appointment" className="bg-surface text-primary px-8 py-3.5 rounded-lg font-label-md text-label-md hover:shadow-lg transition-all">Book Appointment</Link>
            <Link href="/contact" className="bg-primary-container text-on-primary-container px-8 py-3.5 rounded-lg font-label-md text-label-md hover:bg-primary-container/90 transition-all">Contact Clinic</Link>
          </div>
        </div>
      </article>
      </AnimateOnScroll>
    </div>
  )
}
