import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { getBlogBySlug, getRelatedBlogs } from '@/lib/queries';
import { mediaUrl } from '@/lib/supabase';
import { fmtLong, fmtShort } from '@/lib/format';

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: 'Blog Post Not Found', robots: { index: false } };
  return {
    title: { absolute: blog.blog_meta_title || `${blog.blog_title} | St. Joseph Fish Brokerage Inc.` },
    description: blog.blog_meta_description || blog.blog_excerpt || '',
    keywords: blog.blog_meta_keywords || undefined,
    alternates: { canonical: `/blogs/${slug}` },
    openGraph: { type: 'article', title: blog.blog_title, description: blog.blog_excerpt ?? '', url: `/blogs/${slug}`, images: blog.blog_featured_image ? [mediaUrl(blog.blog_featured_image)] : undefined },
  };
}

// Ported from blogs/single.php
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();
  const related = await getRelatedBlogs(blog.blog_id, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumbs alwaysShow items={[{ label: 'Blogs', href: '/blogs' }, { label: blog.blog_title }]} />
      <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
        {/* Content */}
        <div className="lg:col-span-2">
          <div className="py-8 lg:pe-8">
            <div className="space-y-5 lg:space-y-8">
              <Link className="inline-flex items-center gap-x-1.5 text-sm text-gray-500 decoration-2 hover:underline focus:outline-hidden focus:underline" href="/blogs">
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                Back to Blog
              </Link>

              <div className="header-blog-container">
                <div className="orange-slash" />
                <div className="title-blog-content">
                  <div className="flex items-center gap-x-4">
                    <span className="inline-flex items-center py-1.5 px-4 rounded-full text-xs font-bold bg-white text-black uppercase tracking-wide">News</span>
                    <p className="text-xs sm:text-sm text-white/90 font-medium">{fmtLong(blog.blog_published_date)}</p>
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">{blog.blog_title}</h1>
                  {blog.blog_excerpt && (
                    <p className="text-base sm:text-lg text-white italic border-l-[5px] border-black ps-5 leading-relaxed">{blog.blog_excerpt}</p>
                  )}
                </div>
              </div>

              {blog.blog_featured_image && (
                <div className="text-center">
                  <img src={mediaUrl(blog.blog_featured_image)} alt={blog.blog_title} className="w-full h-auto rounded-xl shadow-lg" />
                </div>
              )}

              <div className="text-base text-gray-700 blog-content max-w-none" dangerouslySetInnerHTML={{ __html: blog.blog_content ?? '' }} />

              <div className="w-full h-full">
                <svg preserveAspectRatio="xMidYMid slice" className="w-full h-full object-cover" fill="none" width="1509" height="213" viewBox="0 0 1509 213" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="-41" y="39" width="1550" height="185" fill="#145207" />
                  <path d="M761.338 1.91965C764.714 0.650291 768.291 0 771.897 0H1549C1565.57 0 1579 13.4315 1579 30V183C1579 199.569 1565.57 213 1549 213H365.016C331.632 213 323.209 166.67 354.456 154.92L761.338 1.91965Z" fill="#FF3F00" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 lg:w-full lg:h-full">
          <div className="sticky top-24 start-0 py-8 lg:ps-8">
            <div className="group flex items-center gap-x-3 border-b border-gray-200 pb-8 mb-8">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-semibold">
                {(blog.blog_author ?? 'A').charAt(0).toUpperCase()}
              </div>
              <div className="grow">
                <h5 className="text-sm font-semibold text-gray-900">{blog.blog_author ?? 'Admin'}</h5>
                <p className="text-sm text-gray-500">Author</p>
              </div>
            </div>

            {related.length > 0 && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900">Related Posts</h4>
                {related.map((r) => (
                  <Link key={r.blog_id} className="group flex items-center gap-x-6 focus:outline-hidden" href={`/blogs/${r.blog_slug}`}>
                    <div className="grow">
                      <span className="text-sm font-bold text-gray-900 group-hover:text-orange-600">{r.blog_title}</span>
                      <p className="text-xs text-gray-500 mt-1">{fmtShort(r.blog_published_date)}</p>
                    </div>
                    {r.blog_featured_image && (
                      <div className="shrink-0 relative rounded-lg overflow-hidden size-20">
                        <img className="size-full absolute top-0 start-0 object-cover rounded-lg" src={mediaUrl(r.blog_featured_image)} alt={r.blog_title} />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
