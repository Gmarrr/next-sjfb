import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { getBlogsPage } from '@/lib/queries';
import { mediaUrl } from '@/lib/supabase';
import { fmtLong } from '@/lib/format';

export const revalidate = 300;
const PER_PAGE = 6;

export const metadata: Metadata = {
  title: 'Blogs / News & Updates',
  description: 'Stay informed with the latest news from St. Joseph and the Philippine fishing industry.',
  alternates: { canonical: '/blogs' },
};

type Props = { searchParams: Promise<{ page?: string }> };

// Ported from blogs/index.php
export default async function BlogsPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);
  const { blogs, total } = await getBlogsPage(page, PER_PAGE);
  const totalPages = Math.ceil(total / PER_PAGE);
  const pageHref = (p: number) => (p === 1 ? '/blogs' : `/blogs?page=${p}`);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumbs alwaysShow items={[{ label: 'Blogs', href: '/blogs' }]} />

      <div className="text-center mb-12" data-aos="fade-up">
        <span className="section-eyebrow justify-center">Latest Insights</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">Blogs / News &amp; Updates</h2>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto">Stay informed with the latest news from St. Joseph and the Philippine fishing industry.</p>
      </div>

      {blogs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-10">
            {blogs.map((blog) => (
              <Link key={blog.blog_id} href={`/blogs/${blog.blog_slug}`} className="blog-card group block bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden border border-gray-100 transition-all duration-300">
                <div className="relative h-56 overflow-hidden">
                  {blog.blog_featured_image ? (
                    <img src={mediaUrl(blog.blog_featured_image)} alt={blog.blog_title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">SJ</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-orange-600 text-white text-xs font-semibold rounded-full">{fmtLong(blog.blog_published_date)}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-orange-600 font-semibold text-sm">{(blog.blog_author ?? 'A').charAt(0).toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="ms-3">
                      <p className="text-sm font-medium text-gray-900">{blog.blog_author ?? 'Admin'}</p>
                      <p className="text-xs text-gray-500">{fmtLong(blog.blog_published_date)}</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">{blog.blog_title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{blog.blog_excerpt ?? ''}</p>
                  <div className="flex items-center text-orange-600 font-medium">
                    Read More
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <nav className="flex items-center gap-2" aria-label="Pagination">
                {page > 1 && <Link href={pageHref(page - 1)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Previous</Link>}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((i) => (
                  <Link key={i} href={pageHref(i)} aria-current={i === page ? 'page' : undefined} className={`px-4 py-2 text-sm font-medium border rounded-lg ${i === page ? 'text-white bg-orange-600 border-orange-600' : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'}`}>{i}</Link>
                ))}
                {page < totalPages && <Link href={pageHref(page + 1)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Next</Link>}
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" /></svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No blog posts yet</h3>
          <p className="mt-2 text-gray-500">Check back soon for updates and news from St. Joseph Fish Brokerage Inc.</p>
        </div>
      )}
    </section>
  );
}
