'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useEffect, useRef } from 'react';
import { uploadMedia } from '@/lib/admin/upload';
import { mediaUrl } from '@/lib/supabase';

type Props = { value: string; onChange: (html: string) => void; folder?: string; minHeight?: number; label?: string };

// WYSIWYG editor for blog posts, event descriptions, legal text and rich page sections.
export default function RichTextEditor({ value, onChange, folder = 'content', minHeight = 220, label = 'Content' }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true, // keeps toolbar active-states in sync
    extensions: [StarterKit.configure({ link: { openOnClick: false, autolink: true } }), Image.configure({ inline: false })],
    content: value || '',
    editorProps: { attributes: { class: 'admin-prose focus:outline-none px-4 py-3', style: `min-height:${minHeight}px`, role: 'textbox', 'aria-multiline': 'true', 'aria-label': label } },
    onUpdate: ({ editor: e }) => onChange(e.isEmpty ? '' : e.getHTML()),
  });

  // Keep editor in sync if the value is replaced from outside (e.g. "reset to default")
  useEffect(() => {
    if (editor && value !== editor.getHTML() && !(editor.isEmpty && !value)) editor.commands.setContent(value || '', { emitUpdate: false });
  }, [value, editor]);

  if (!editor) return <div className="rounded-lg border border-slate-200 bg-slate-50 animate-pulse" style={{ height: minHeight + 44 }} />;

  const state = {
    bold: editor.isActive('bold'), italic: editor.isActive('italic'), underline: editor.isActive('underline'), strike: editor.isActive('strike'),
    h2: editor.isActive('heading', { level: 2 }), h3: editor.isActive('heading', { level: 3 }), bullet: editor.isActive('bulletList'),
    ordered: editor.isActive('orderedList'), quote: editor.isActive('blockquote'), link: editor.isActive('link'),
    canUndo: editor.can().undo(), canRedo: editor.can().redo(),
  };

  const Btn = ({ on, active, title, children, disabled }: { on: () => void; active?: boolean; title: string; children: React.ReactNode; disabled?: boolean }) => (
    <button type="button" title={title} aria-label={title} aria-pressed={active === undefined ? undefined : active} disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={on}
      className={`h-9 min-w-9 px-2 rounded-md text-sm font-semibold transition ${active ? 'bg-orange-100 text-orange-700' : 'text-slate-600 hover:bg-slate-100'} disabled:opacity-30`}>
      {children}
    </button>
  );

  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL (leave empty to remove)', prev ?? 'https://');
    if (url === null) return;
    if (url === '' ) editor.chain().focus().extendMarkRange('link').unsetLink().run();
    else editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = async (file?: File) => {
    if (!file) return;
    try {
      const path = await uploadMedia(file, folder);
      editor.chain().focus().setImage({ src: mediaUrl(path), alt: file.name.replace(/\.[^.]+$/, '') }).run();
    } catch (e) { alert(e instanceof Error ? e.message : 'Upload failed'); }
  };

  return (
    <div className="rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:border-orange-500 focus-within:ring-[3px] focus-within:ring-orange-500/10 transition">
      <div role="toolbar" aria-label={`${label} formatting`} className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-1.5 py-1">
        <Btn title="Bold" active={state.bold} on={() => editor.chain().focus().toggleBold().run()}><b>B</b></Btn>
        <Btn title="Italic" active={state.italic} on={() => editor.chain().focus().toggleItalic().run()}><i>I</i></Btn>
        <Btn title="Underline" active={state.underline} on={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></Btn>
        <Btn title="Strikethrough" active={state.strike} on={() => editor.chain().focus().toggleStrike().run()}><s>S</s></Btn>
        <span aria-hidden="true" className="w-px h-5 bg-slate-200 mx-1" />
        <Btn title="Heading" active={state.h2} on={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Btn>
        <Btn title="Subheading" active={state.h3} on={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</Btn>
        <Btn title="Bullet list" active={state.bullet} on={() => editor.chain().focus().toggleBulletList().run()}>• List</Btn>
        <Btn title="Numbered list" active={state.ordered} on={() => editor.chain().focus().toggleOrderedList().run()}>1. List</Btn>
        <Btn title="Quote" active={state.quote} on={() => editor.chain().focus().toggleBlockquote().run()}>“ ”</Btn>
        <span aria-hidden="true" className="w-px h-5 bg-slate-200 mx-1" />
        <Btn title="Link" active={state.link} on={setLink}><svg aria-hidden="true" className="size-4 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></Btn>
        <Btn title="Insert image" on={() => fileRef.current?.click()}><svg aria-hidden="true" className="size-4 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></Btn>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { addImage(e.target.files?.[0]); e.target.value = ''; }} />
        <span aria-hidden="true" className="w-px h-5 bg-slate-200 mx-1" />
        <Btn title="Undo" disabled={!state.canUndo} on={() => editor.chain().focus().undo().run()}><svg aria-hidden="true" className="size-4 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg></Btn>
        <Btn title="Redo" disabled={!state.canRedo} on={() => editor.chain().focus().redo().run()}><svg aria-hidden="true" className="size-4 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg></Btn>
        <Btn title="Clear formatting" on={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>Tx</Btn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
