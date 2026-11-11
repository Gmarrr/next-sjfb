'use client';

import { useRouter } from 'next/navigation';
import { resetContent, saveContent } from '@/lib/admin/actions';
import type { Field, SectionDef } from '@/lib/content/schema';
import { Card, Label, btnSecondary, inputCls } from './ui';
import { ImageField, ImagesField } from './ImageField';
import { ObjectListField, StringListField } from './ListFields';
import RichTextEditor from './RichTextEditor';
import SaveBar from './SaveBar';
import { useSaveForm } from './useSaveForm';

type Data = Record<string, unknown>;

function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const id = `f-${field.name}`;
  switch (field.type) {
    case 'text':
    case 'url':
      return <input id={id} type={field.type === 'url' ? 'url' : 'text'} className={inputCls} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />;
    case 'textarea':
      return <textarea id={id} rows={3} className={inputCls} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />;
    case 'title':
      return <textarea id={id} rows={Math.min(4, Math.max(1, String(value ?? '').split('\n').length))} className={`${inputCls} font-semibold`} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />;
    case 'richtext':
      return <RichTextEditor value={(value as string) ?? ''} onChange={onChange} folder={field.folder ?? 'pages'} minHeight={140} />;
    case 'image':
      return <ImageField folder={field.folder ?? 'pages'} value={(value as string) ?? ''} onChange={onChange} />;
    case 'video':
      return <ImageField folder={field.folder ?? 'videos'} accept="video/mp4,video/webm" value={(value as string) ?? ''} onChange={onChange} />;
    case 'images':
      return <ImagesField folder={field.folder ?? 'pages'} value={(value as string[]) ?? []} onChange={onChange} />;
    case 'strings':
      return <StringListField value={(value as string[]) ?? []} onChange={onChange} placeholder="Line" multiline />;
    case 'list': {
      const sub = field.fields ?? [];
      const blank = Object.fromEntries(sub.map((f) => [f.name, f.type === 'images' || f.type === 'strings' ? [] : '']));
      return (
        <ObjectListField<Data>
          value={(value as Data[]) ?? []}
          onChange={onChange}
          blank={blank}
          itemTitle={(item, i) => String(item[sub[0]?.name] || item[sub[1]?.name] || `Item ${i + 1}`).slice(0, 60)}
          render={(item, set) => sub.map((f) => (
            <div key={f.name}>
              <Label help={f.help}>{f.label}</Label>
              <FieldInput field={f} value={item[f.name]} onChange={(v) => set({ [f.name]: v })} />
            </div>
          ))}
        />
      );
    }
  }
}

export default function ContentForm({ section, initial, customized }: { section: SectionDef; initial: Data; customized: boolean }) {
  const router = useRouter();
  const { data, set, state, dirty, save, setState } = useSaveForm<Data>(initial);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await save((d) => saveContent(section.key, d), 'Saved — the website is updated.');
    if (res.ok) router.refresh();
  };

  const onReset = async () => {
    if (!window.confirm(`Reset “${section.title}” to the original website text and photos? Your edits to this section will be lost.`)) return;
    setState({ kind: 'saving' });
    const res = await resetContent(section.key);
    if (res.ok) window.location.reload();
    else setState({ kind: 'error', message: res.error });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {section.groups.map((g) => (
        <Card key={g.title} title={g.title}>
          {g.fields.map((f) => (
            <div key={f.name}>
              <Label htmlFor={`f-${f.name}`} help={f.help}>{f.label}</Label>
              <FieldInput field={f} value={data[f.name]} onChange={(v) => set(f.name, v)} />
            </div>
          ))}
        </Card>
      ))}
      <SaveBar
        state={state}
        dirty={dirty}
        extra={
          <>
            <a href={section.path} target="_blank" rel="noopener" className={btnSecondary}>Preview ↗</a>
            {customized && <button type="button" onClick={onReset} className="text-xs font-semibold text-slate-400 hover:text-red-600 px-2">Reset to original</button>}
          </>
        }
      />
    </form>
  );
}
