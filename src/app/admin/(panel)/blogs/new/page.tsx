import type { Metadata } from 'next';
import { PageHeader } from '@/components/admin/ui';
import BlogForm from '@/components/admin/BlogForm';
import { requireAdmin } from '@/lib/supabase/server';
import { todayManila } from '@/lib/format';

export const metadata: Metadata = { title: 'New blog post' };

export default async function NewBlogPage() {
  const { admin } = await requireAdmin();
  return (
    <>
      <PageHeader title="New blog post" back={{ href: '/admin/blogs', label: 'All posts' }} />
      <BlogForm initial={{ blog_title: '', blog_slug: '', blog_status: 'draft', blog_published_date: todayManila(), blog_author: admin.full_name ?? 'SJFB Editorial' }} />
    </>
  );
}
