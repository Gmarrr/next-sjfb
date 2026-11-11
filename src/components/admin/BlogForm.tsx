'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { saveBlog, type BlogInput } from '@/lib/admin/actions';
import { slugify } from '@/lib/admin/slug';
import { Card, Label, inputCls } from './ui';
import { ImageField } from './ImageField';
import RichTextEditor from './RichTextEditor';
import SaveBar from './SaveBar';
import { useSaveForm } from './useSaveForm';

export default function BlogForm({ initial }: { initial: BlogInput }) {
  const router = useRouter();
  const isNew = !initial.blog_id;
  const { data, set, setData, state, dirty, save } = useSaveForm<BlogInput>(initial);
  const [slugTouched, setSlugTouched] = useState(!isNew);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await save(saveBlog, data.blog_status === 'published' ? 'Saved — live on the website.' : 'Saved as draft.');
    if (res.ok && isNew && res.id) router.replace(`/admin/blogs/${res.id}?created=1`);
    else if (res.ok) router.refresh();
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="grid lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <div>
              <Label htmlFor="title" required>Title</Label>
              <input id="title" required className={`${inputCls} text-base font-semibold`} value={data.blog_title} onChange={(e) => { const v = e.target.value; setData((d) => ({ ...d, blog_title: v, blog_slug: slugTouched ? d.blog_slug : slugify(v) })); }} />
            </div>
            <div>
              <Label htmlFor="slug" required>URL slug</Label>
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 focus-within:border-orange-500">
                <span className="pl-3 text-xs text-slate-400">/blogs/</span>
                <input id="slug" required className="flex-1 bg-transparent py-2 pr-3 text-sm focus:outline-none" value={data.blog_slug} onChange={(e) => { setSlugTouched(true); set('blog_slug', slugify(e.target.value)); }} />
              </div>
            </div>
            <div>
              <Label htmlFor="ex" help="Shown on blog cards and under the title.">Excerpt</Label>
              <textarea id="ex" rows={2} className={inputCls} value={data.blog_excerpt ?? ''} onChange={(e) => set('blog_excerpt', e.target.value)} />
            </div>
          </Card>
          <Card title="Content">
            <RichTextEditor value={data.blog_content ?? ''} onChange={(v) => set('blog_content', v)} folder="blogs/content" minHeight={360} />
          </Card>
          <Card title="SEO (optional)">
            <div><Label htmlFor="mt">Meta title</Label><input id="mt" className={inputCls} value={data.blog_meta_title ?? ''} onChange={(e) => set('blog_meta_title', e.target.value)} placeholder="Leave empty to use the title" /></div>
            <div><Label htmlFor="md">Meta description</Label><textarea id="md" rows={2} className={inputCls} value={data.blog_meta_description ?? ''} onChange={(e) => set('blog_meta_description', e.target.value)} placeholder="Leave empty to use the excerpt" /></div>
            <div><Label htmlFor="mk">Meta keywords</Label><input id="mk" className={inputCls} value={data.blog_meta_keywords ?? ''} onChange={(e) => set('blog_meta_keywords', e.target.value)} /></div>
          </Card>
        </div>
        <div className="space-y-5 lg:sticky lg:top-6">
          <Card title="Publishing">
            <div className="grid grid-cols-2 gap-2">
              {(['draft', 'published'] as const).map((s) => (
                <button key={s} type="button" onClick={() => set('blog_status', s)} className={`py-2 rounded-lg text-sm font-semibold border transition ${data.blog_status === s ? (s === 'published' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-amber-50 border-amber-300 text-amber-700') : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                  {s === 'published' ? '✅ Published' : '📝 Draft'}
                </button>
              ))}
            </div>
            <div><Label htmlFor="pd">Publish date</Label><input id="pd" type="date" className={inputCls} value={data.blog_published_date} onChange={(e) => set('blog_published_date', e.target.value)} /></div>
            <div><Label htmlFor="au">Author</Label><input id="au" className={inputCls} value={data.blog_author ?? ''} onChange={(e) => set('blog_author', e.target.value)} placeholder="SJFB Editorial" /></div>
            {!isNew && data.blog_status === 'published' && <a href={`/blogs/${initial.blog_slug}`} target="_blank" rel="noopener" className="text-xs font-semibold text-orange-600 hover:underline">View on website ↗</a>}
          </Card>
          <Card title="Featured image">
            <ImageField folder="blogs" value={data.blog_featured_image ?? ''} onChange={(v) => set('blog_featured_image', v)} />
          </Card>
        </div>
      </div>
      <SaveBar state={state} dirty={dirty} label={isNew ? 'Create post' : 'Save changes'} />
    </form>
  );
}
