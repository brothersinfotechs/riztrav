import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Plus, Bold, Italic, UnderlineIcon, Link as LinkIcon, Image as ImageI, List, ListOrdered, Heading2, Heading3 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/blog")({ component: Page });

function Btn({ onClick, active, children }: { onClick: () => void; active?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`p-2 rounded hover:bg-gray-100 ${active ? "bg-gray-200" : ""}`}>
      {children}
    </button>
  );
}

function Page() {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState<any | null>(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin", "blog_posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id,title,slug,category,is_published,published_at,created_at,cover_image,excerpt")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 30_000,
  });

  const delMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "blog_posts"] });
      toast.success("Post deleted");
    },
  });

  if (editing) {
    return (
      <BlogEditor
        post={editing}
        onCancel={() => setEditing(null)}
        onSaved={() => {
          qc.invalidateQueries({ queryKey: ["admin", "blog_posts"] });
          setEditing(null);
        }}
      />
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Blog"
        description="Manage blog posts"
        action={
          <Button
            onClick={() => setEditing({ title: "", slug: "", excerpt: "", content: "", category: "", cover_image: "", is_published: false })}
            className="bg-[#E8651A] hover:bg-[#E8651A]/90"
          >
            <Plus className="h-4 w-4 mr-1" /> New Post
          </Button>
        }
      />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 font-semibold">Title</th>
              <th className="text-left p-3 font-semibold">Category</th>
              <th className="text-left p-3 font-semibold">Status</th>
              <th className="text-right p-3 font-semibold w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={4} className="p-6 text-center text-gray-500">Loading…</td></tr>}
            {!isLoading && posts.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-gray-500">No posts yet.</td></tr>}
            {posts.map((p: any) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{p.title}</td>
                <td className="p-3">{p.category || "—"}</td>
                <td className="p-3">{p.is_published ? <span className="text-green-600">Published</span> : <span className="text-gray-400">Draft</span>}</td>
                <td className="p-3 text-right">
                  <Button size="icon" variant="ghost" onClick={() => setEditing(p)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete?")) delMut.mutate(p.id); }}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function BlogEditor({ post, onCancel, onSaved }: { post: any; onCancel: () => void; onSaved: () => void }) {
  const [data, setData] = React.useState(post);
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false }), Image, Underline],
    content: post.content || "",
    editorProps: {
      attributes: {
        class: "prose max-w-none min-h-[400px] p-4 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      setData((d: any) => ({ ...d, content: editor.getHTML() }));
    },
  });

  const saveMut = useMutation({
    mutationFn: async () => {
      const payload = { ...data, content: editor?.getHTML() || data.content };
      if (payload.id) {
        const { id, ...rest } = payload;
        const { error } = await supabase.from("blog_posts").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { toast.success("Post saved"); onSaved(); },
    onError: (e: any) => toast.error(e.message),
  });

  if (!editor) return null;


  return (
    <>
      <AdminPageHeader
        title={data.id ? "Edit Post" : "New Post"}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button className="bg-[#E8651A] hover:bg-[#E8651A]/90" disabled={saveMut.isPending} onClick={() => saveMut.mutate()}>Save</Button>
          </div>
        }
      />

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <Label>Title</Label>
          <Input value={data.title || ""} onChange={(e) => setData({ ...data, title: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Slug</Label>
            <Input value={data.slug || ""} onChange={(e) => setData({ ...data, slug: e.target.value })} placeholder="url-friendly-slug" />
          </div>
          <div>
            <Label>Category</Label>
            <Input value={data.category || ""} onChange={(e) => setData({ ...data, category: e.target.value })} />
          </div>
        </div>
        <div>
          <Label>Cover Image URL</Label>
          <Input value={data.cover_image || ""} onChange={(e) => setData({ ...data, cover_image: e.target.value })} />
        </div>
        <div>
          <Label>Excerpt</Label>
          <Textarea rows={2} value={data.excerpt || ""} onChange={(e) => setData({ ...data, excerpt: e.target.value })} />
        </div>
        <div>
          <Label>Content</Label>
          <div className="border rounded-md mt-1">
            <div className="border-b p-2 flex flex-wrap gap-1 bg-gray-50">
              <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}><Bold className="h-4 w-4" /></Btn>
              <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><Italic className="h-4 w-4" /></Btn>
              <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")}><UnderlineIcon className="h-4 w-4" /></Btn>
              <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}><Heading2 className="h-4 w-4" /></Btn>
              <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}><Heading3 className="h-4 w-4" /></Btn>
              <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}><List className="h-4 w-4" /></Btn>
              <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}><ListOrdered className="h-4 w-4" /></Btn>
              <Btn onClick={() => {
                const url = prompt("URL");
                if (url) editor.chain().focus().setLink({ href: url }).run();
              }} active={editor.isActive("link")}><LinkIcon className="h-4 w-4" /></Btn>
              <Btn onClick={() => {
                const url = prompt("Image URL");
                if (url) editor.chain().focus().setImage({ src: url }).run();
              }}><ImageI className="h-4 w-4" /></Btn>
            </div>
            <EditorContent editor={editor} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={!!data.is_published} onCheckedChange={(v) => setData({ ...data, is_published: v, published_at: v && !data.published_at ? new Date().toISOString() : data.published_at })} />
          <Label>Published</Label>
        </div>
      </div>
    </>
  );
}
