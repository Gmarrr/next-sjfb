import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/admin/ui';
import BlogForm from '@/components/admin/BlogForm';
import ConfirmButton from '@/components/admin/ConfirmButton';
import { requireAdmin } from '@/lib/supabase/server';
import { deleteBlog } from '@/lib/admin/actions';
import type { BlogRow } from '@/lib/types';

export const metadata: Metadata = { title: 'Edit blog post' };

export default async function EditBlogPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  const { id } = await params;
  const { created } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('blogs').select('*').eq('blog_id', Number(id)).maybeSingle();
  if (!data) notFound();
  const b = data as BlogRow;
  const manilaDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila' }).format(new Date(b.blog_published_date));
  return (
    <>
      <PageHeader title={b.blog_title} back={{ href: '/admin/blogs', label: 'All posts' }} actions={<ConfirmButton action={deleteBlog.bind(null, b.blog_id)} confirm={`Delete "${b.blog_title}"?`} label="Delete post" redirectTo="/admin/blogs" />} />
      {created && <div className="mb-5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-3">Post created.</div>}
      <BlogForm key={b.blog_id} initial={{
        blog_id: b.blog_id, blog_title: b.blog_title, blog_slug: b.blog_slug, blog_status: b.blog_status, blog_author: b.blog_author ?? '',
        blog_excerpt: b.blog_excerpt ?? '', blog_content: b.blog_content ?? '', blog_featured_image: b.blog_featured_image ?? '', blog_published_date: manilaDate,
        blog_meta_title: b.blog_meta_title ?? '', blog_meta_description: b.blog_meta_description ?? '', blog_meta_keywords: b.blog_meta_keywords ?? '',
      }} />
    </>
  );
}
