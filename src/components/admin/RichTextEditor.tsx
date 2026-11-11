'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useEffect, useRef } from 'react';
import { uploadMedia } from '@/lib/admin/upload';
import { mediaUrl } from '@/lib/supabase';

type Props = { value: string; onChange: (html: string) => void; folder?: string; minHeight?: number };

// WYSIWYG editor for blog posts, event descriptions, legal text and rich page sections.
export default function RichTextEditor({ value, onChange, folder = 'content', minHeight = 220 }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true, // keeps toolbar active-states in sync
    extensions: [StarterKit.configure({ link: { openOnClick: false, autolink: true } }), Image.configure({ inline: false })],
    content: value || '',
    editorProps: { attributes: { class: 'admin-prose focus:outline-none px-4 py-3', style: `min-height:${minHeight}px` } },
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
    <button type="button" title={title} aria-label={title} disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={on}
      className={`h-8 min-w-8 px-1.5 rounded-md text-sm font-semibold transition ${active ? 'bg-orange-100 text-orange-700' : 'text-slate-600 hover:bg-slate-100'} disabled:opacity-30`}>
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
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden focus-within:border-orange-500 focus-within:ring-[3px] focus-within:ring-orange-500/10 transition">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-1.5 py-1">
        <Btn title="Bold" active={state.bold} on={() => editor.chain().focus().toggleBold().run()}><b>B</b></Btn>
        <Btn title="Italic" active={state.italic} on={() => editor.chain().focus().toggleItalic().run()}><i>I</i></Btn>
        <Btn title="Underline" active={state.underline} on={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></Btn>
        <Btn title="Strikethrough" active={state.strike} on={() => editor.chain().focus().toggleStrike().run()}><s>S</s></Btn>
        <span className="w-px h-5 bg-slate-200 mx-1" />
        <Btn title="Heading" active={state.h2} on={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Btn>
        <Btn title="Subheading" active={state.h3} on={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</Btn>
        <Btn title="Bullet list" active={state.bullet} on={() => editor.chain().focus().toggleBulletList().run()}>• List</Btn>
        <Btn title="Numbered list" active={state.ordered} on={() => editor.chain().focus().toggleOrderedList().run()}>1. List</Btn>
        <Btn title="Quote" active={state.quote} on={() => editor.chain().focus().toggleBlockquote().run()}>“ ”</Btn>
        <span className="w-px h-5 bg-slate-200 mx-1" />
        <Btn title="Link" active={state.link} on={setLink}>🔗</Btn>
        <Btn title="Insert image" on={() => fileRef.current?.click()}>🖼️</Btn>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { addImage(e.target.files?.[0]); e.target.value = ''; }} />
        <span className="w-px h-5 bg-slate-200 mx-1" />
        <Btn title="Undo" disabled={!state.canUndo} on={() => editor.chain().focus().undo().run()}>↶</Btn>
        <Btn title="Redo" disabled={!state.canRedo} on={() => editor.chain().focus().redo().run()}>↷</Btn>
        <Btn title="Clear formatting" on={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>Tx</Btn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
