import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/supabase/server';
import { mediaUrl } from '@/lib/supabase';
import { Badge, ButtonLink, EmptyState, PageHeader, Thumb } from '@/components/admin/ui';
import ListToolbar from '@/components/admin/ListToolbar';
import Pagination from '@/components/admin/Pagination';
import ConfirmButton from '@/components/admin/ConfirmButton';
import { deleteBlog } from '@/lib/admin/actions';
import { fmtShort } from '@/lib/format';
import type { BlogRow } from '@/lib/types';

export const metadata: Metadata = { title: 'Blogs' };
const PER = 15;

export default async function AdminBlogsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; page?: string }> }) {
  const { q, status, page: p } = await searchParams;
  const page = Math.max(1, Number(p) || 1);
  const { supabase } = await requireAdmin();
  let query = supabase.from('blogs').select('blog_id, blog_title, blog_slug, blog_status, blog_author, blog_published_date, blog_featured_image', { count: 'exact' });
  if (q) query = query.ilike('blog_title', `%${q}%`);
  if (status) query = query.eq('blog_status', status);
  const { data, count } = await query.order('blog_published_date', { ascending: false }).range((page - 1) * PER, page * PER - 1);
  const blogs = (data ?? []) as BlogRow[];

  return (
    <>
      <PageHeader title="Blogs" description="News and updates shown on the Blogs page and home page." actions={<ButtonLink href="/admin/blogs/new">+ New post</ButtonLink>} />
      <ListToolbar placeholder="Search posts…" statuses={[{ value: 'published', label: 'Published' }, { value: 'draft', label: 'Draft' }]} />
      {blogs.length === 0 ? (
        <EmptyState title={q || status ? 'No posts match your filters' : 'No blog posts yet'} action={<ButtonLink href="/admin/blogs/new">+ New post</ButtonLink>} />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,.04),0_4px_16px_-8px_rgba(15,23,42,.08)] overflow-hidden">
          <table className="admin-table w-full text-sm">
            <thead className="bg-slate-50/95 backdrop-blur text-left text-[.7rem] font-bold text-slate-500 uppercase tracking-wider">
              <tr><th className="px-4 py-3">Post</th><th className="px-4 py-3 hidden md:table-cell">Date</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {blogs.map((b) => (
                <tr key={b.blog_id} className="hover:bg-orange-50/30">
                  <td className="px-4 py-3">
                    <Link href={`/admin/blogs/${b.blog_id}`} className="flex items-center gap-3 group">
                      <Thumb src={mediaUrl(b.blog_featured_image)} />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 group-hover:text-orange-600 truncate">{b.blog_title}</p>
                        <p className="text-xs text-slate-400">{b.blog_author ?? 'SJFB Editorial'}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600 hidden md:table-cell whitespace-nowrap">{fmtShort(b.blog_published_date)}</td>
                  <td className="px-4 py-3"><Badge value={b.blog_status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      {b.blog_status === 'published' && <a href={`/blogs/${b.blog_slug}`} target="_blank" rel="noopener" className="text-xs font-semibold text-slate-500 hover:text-slate-800">View</a>}
                      <Link href={`/admin/blogs/${b.blog_id}`} className="text-xs font-semibold text-orange-600 hover:underline">Edit</Link>
                      <ConfirmButton small action={deleteBlog.bind(null, b.blog_id)} confirm={`Delete "${b.blog_title}"?`} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} total={count ?? 0} perPage={PER} base="/admin/blogs" params={{ q, status }} />
    </>
  );
}
