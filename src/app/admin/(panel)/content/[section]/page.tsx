import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/ui';
import ContentForm from '@/components/admin/ContentForm';
import { sectionByKey } from '@/lib/content/schema';
import { mergeContent } from '@/lib/content/get';

export const metadata: Metadata = { title: 'Edit page content' };

export default async function ContentSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section: key } = await params;
  const section = sectionByKey(key);
  if (!section) notFound();
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('site_content').select('data').eq('key', key).maybeSingle();
  const initial = mergeContent(section.key, data?.data as Record<string, unknown> | undefined) as Record<string, unknown>;
  return (
    <>
      <PageHeader title={section.title} description={section.description} back={{ href: '/admin/content', label: 'Page Content' }} />
      <div className="mb-5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-sm px-4 py-3">
        <strong>Tip:</strong> in title fields, wrap words in <code className="bg-white px-1 rounded">[square brackets]</code> to highlight them in orange, and press Enter for a new line.
        Empty fields fall back to the original text.
      </div>
      <ContentForm key={key} section={section} initial={initial} customized={Boolean(data)} />
    </>
  );
}
