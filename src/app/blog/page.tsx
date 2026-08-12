import type { Metadata } from "next"
import Link from "next/link"
import { blogPosts } from "@/lib/blog-posts"
import { safeMaterialIcon } from "@/lib/material-icons"
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll"

export const metadata: Metadata = {
  title: "Dental Health Blog | Tips & Treatments",
  description:
    "Practical dental health tips, treatment guides and honest pricing from the Nisa Dental team in Sialkot. Read about root canals, braces, implants and more.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Dental Health Blog | Nisa Dental & Surgical",
    description: "Practical dental health tips and treatment guides from Nisa Dental, Sialkot.",
    type: "website",
    url: "/blog",
  },
}

export default function BlogPage() {
  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <AnimateOnScroll>
        <p className="text-caption uppercase tracking-widest text-primary mb-4">Health & Care Tips</p>
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">Dental Health Blog</h1>
        <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-6" />
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Guides and advice from our team to help you keep a healthy, confident smile.
        </p>
        </AnimateOnScroll>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {blogPosts.map((post, i) => (
          <AnimateOnScroll key={post.slug} delay={Math.min(i * 0.05, 0.2)}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-surface-container-low p-8 rounded-xl border border-outline-variant/30 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 h-full"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <span className="material-symbols-outlined text-primary text-2xl">{safeMaterialIcon(post.coverIcon)}</span>
              </div>
              <div className="flex items-center gap-3 text-caption text-on-surface-variant mb-2">
                <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[11px]">{post.category}</span>
                <span>{post.date}</span>
                <span>· {post.readMinutes} min read</span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors mb-3">{post.title}</h2>
              <p className="text-on-surface-variant text-caption line-clamp-3 mb-4">{post.excerpt}</p>
              <span className="mt-auto inline-flex items-center gap-1 text-primary font-label-md text-label-md">
                Read article <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </span>
            </Link>
          </AnimateOnScroll>
        ))}
      </div>

      <AnimateOnScroll>
      <div className="mt-16 max-w-4xl mx-auto bg-primary rounded-2xl p-10 md:p-12 text-center text-on-primary">
        <h2 className="font-headline-lg text-headline-lg mb-3">Have a dental concern?</h2>
        <p className="text-on-primary/80 max-w-xl mx-auto mb-7">Skip the search — talk to our team directly about your teeth.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/appointment" className="bg-surface text-primary px-10 py-4 rounded-lg font-label-md text-label-md hover:shadow-xl transition-all">Book an Appointment</Link>
          <Link href="/services" className="bg-primary-container text-on-primary-container px-10 py-4 rounded-lg font-label-md text-label-md hover:bg-primary-container/90 transition-all">View Services</Link>
        </div>
      </div>
      </AnimateOnScroll>
    </div>
  )
}
