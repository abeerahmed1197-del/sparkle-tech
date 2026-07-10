import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Button } from '@/components/ui/button';
import {
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Heading1, Heading2,
  Heading3, Link as LinkIcon, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight,
  Quote, Code, Undo, Redo, Minus,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const ToolBtn = ({ active, onClick, children, title }: { active?: boolean; onClick: () => void; children: React.ReactNode; title: string }) => (
  <Button
    type="button"
    variant={active ? 'secondary' : 'ghost'}
    size="icon"
    className="h-8 w-8"
    onClick={onClick}
    title={title}
  >
    {children}
  </Button>
);

const uploadImage = async (file: File): Promise<string | null> => {
  const ext = file.name.split('.').pop() || 'png';
  const path = `rte/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('product-images').upload(path, file);
  if (error) {
    toast.error(`Image upload failed: ${error.message}`);
    return null;
  }
  return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl;
};

const Toolbar = ({ editor }: { editor: Editor }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b bg-secondary/40 px-1 py-1 rounded-t-md">
      <ToolBtn title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></ToolBtn>
      <ToolBtn title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></ToolBtn>
      <ToolBtn title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon className="h-4 w-4" /></ToolBtn>
      <span className="w-px h-5 bg-border mx-1" />
      <ToolBtn title="H1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 className="h-4 w-4" /></ToolBtn>
      <ToolBtn title="H2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></ToolBtn>
      <ToolBtn title="H3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="h-4 w-4" /></ToolBtn>
      <span className="w-px h-5 bg-border mx-1" />
      <ToolBtn title="Bullet List" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></ToolBtn>
      <ToolBtn title="Ordered List" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></ToolBtn>
      <ToolBtn title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-4 w-4" /></ToolBtn>
      <ToolBtn title="Code" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code className="h-4 w-4" /></ToolBtn>
      <span className="w-px h-5 bg-border mx-1" />
      <ToolBtn title="Align Left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft className="h-4 w-4" /></ToolBtn>
      <ToolBtn title="Align Center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter className="h-4 w-4" /></ToolBtn>
      <ToolBtn title="Align Right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight className="h-4 w-4" /></ToolBtn>
      <span className="w-px h-5 bg-border mx-1" />
      <ToolBtn title="Link" active={editor.isActive('link')} onClick={() => {
        const prev = editor.getAttributes('link').href;
        const url = window.prompt('URL', prev || 'https://');
        if (url === null) return;
        if (url === '') editor.chain().focus().extendMarkRange('link').unsetLink().run();
        else editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      }}><LinkIcon className="h-4 w-4" /></ToolBtn>
      <ToolBtn title="Image" onClick={() => fileRef.current?.click()}><ImageIcon className="h-4 w-4" /></ToolBtn>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={async e => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = await uploadImage(file);
        if (url) editor.chain().focus().setImage({ src: url, alt: file.name }).run();
        e.target.value = '';
      }} />
      <ToolBtn title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus className="h-4 w-4" /></ToolBtn>
      <span className="w-px h-5 bg-border mx-1" />
      <ToolBtn title="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo className="h-4 w-4" /></ToolBtn>
      <ToolBtn title="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo className="h-4 w-4" /></ToolBtn>
    </div>
  );
};

const RichTextEditor = ({ value, onChange, placeholder, minHeight = 200 }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ inline: false, HTMLAttributes: { class: 'rounded-lg my-3' } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-primary underline' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none px-4 py-3',
        style: `min-height: ${minHeight}px`,
        'data-placeholder': placeholder || '',
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of Array.from(items)) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              event.preventDefault();
              uploadImage(file).then(url => {
                if (url && editor) editor.chain().focus().setImage({ src: url }).run();
              });
              return true;
            }
          }
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value === '' ? '' : null]); // only sync when explicitly reset

  if (!editor) return null;

  return (
    <div className="border rounded-md bg-background">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
