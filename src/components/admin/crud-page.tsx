import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "./admin-shell";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "boolean" | "select" | "image" | "json" | "richtext";
  options?: { label: string; value: string }[];
  bucket?: string; // for image uploads
  placeholder?: string;
  defaultValue?: unknown;
  hidden?: boolean;
  rows?: number;
  helper?: string;
};

export type CrudConfig = {
  table: string;
  title: string;
  description?: string;
  singular: string;
  orderBy?: { column: string; ascending?: boolean };
  listColumns: { name: string; label: string; render?: (row: any) => React.ReactNode }[];
  fields: FieldDef[];
};

async function uploadFile(bucket: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

const PAGE_SIZE = 20;

export const CrudPage = React.memo(function CrudPage({ config }: { config: CrudConfig }) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState<any | null>(null);
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);

  const selectCols = React.useMemo(() => {
    const cols = new Set<string>(["id"]);
    config.listColumns.forEach((c) => cols.add(c.name));
    config.fields.forEach((f) => cols.add(f.name));
    cols.add(config.orderBy?.column ?? "created_at");
    return Array.from(cols).join(",");
  }, [config]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", config.table, page, selectCols],
    queryFn: async () => {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      let q = supabase.from(config.table as any).select(selectCols, { count: "exact" });
      if (config.orderBy) {
        q = q.order(config.orderBy.column, { ascending: config.orderBy.ascending ?? true });
      } else {
        q = q.order("created_at", { ascending: false });
      }
      const { data, error, count } = await q.range(from, to);
      if (error) throw error;
      return { rows: (data ?? []) as any[], count: count ?? 0 };
    },
    staleTime: 30_000,
  });

  const rows = data?.rows ?? [];
  const total = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const saveMut = useMutation({
    mutationFn: async (payload: any) => {
      if (payload.id) {
        const { id, ...rest } = payload;
        const { error } = await supabase.from(config.table as any).update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(config.table as any).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", config.table] });
      qc.invalidateQueries({ queryKey: ["pub"] });
      toast.success(`${config.singular} saved`);
      setOpen(false);
      setEditing(null);
    },
    onError: (e: any) => {
      const msg = String(e?.message || "");
      if (msg.includes("_category_check") || msg.includes("check constraint")) {
        toast.error("Please check category value and try again");
      } else {
        toast.error(msg || "Save failed");
      }
    },
  });

  const delMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(config.table as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", config.table] });
      qc.invalidateQueries({ queryKey: ["pub"] });
      toast.success(`${config.singular} deleted`);
    },
    onError: (e: any) => toast.error(e.message || "Delete failed"),
  });

  const openNew = React.useCallback(() => {
    const init: any = {};
    config.fields.forEach((f) => {
      init[f.name] = f.defaultValue ?? (f.type === "boolean" ? false : f.type === "number" ? 0 : f.type === "json" ? "[]" : "");
    });
    setEditing(init);
    setOpen(true);
  }, [config.fields]);

  const openEdit = React.useCallback((row: any) => {
    const init: any = { id: row.id };
    config.fields.forEach((f) => {
      let v = row[f.name];
      if (f.type === "json") v = JSON.stringify(v ?? [], null, 2);
      init[f.name] = v ?? (f.type === "boolean" ? false : "");
    });
    setEditing(init);
    setOpen(true);
  }, [config.fields]);

  const onDelete = React.useCallback((id: string) => {
    if (confirm("Delete this item?")) delMut.mutate(id);
  }, [delMut]);

  return (
    <>
      <AdminPageHeader
        title={config.title}
        description={config.description}
        action={
          <Button onClick={openNew} className="bg-[#E8651A] hover:bg-[#E8651A]/90">
            <Plus className="h-4 w-4 mr-1" /> New {config.singular}
          </Button>
        }
      />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {config.listColumns.map((c) => (
                <th key={c.name} className="text-left p-3 font-semibold text-gray-700">
                  {c.label}
                </th>
              ))}
              <th className="text-right p-3 font-semibold text-gray-700 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b">
                  {config.listColumns.map((c) => (
                    <td key={c.name} className="p-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  ))}
                  <td className="p-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                </tr>
              ))
            )}
            {!isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={config.listColumns.length + 1} className="p-6 text-center text-gray-500">
                  No {config.singular.toLowerCase()}s yet.
                </td>
              </tr>
            )}
            {rows.map((row: any) => (
              <CrudRow
                key={row.id}
                row={row}
                columns={config.listColumns}
                onEdit={openEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
        {total > PAGE_SIZE && (
          <div className="flex items-center justify-between p-3 border-t text-sm text-gray-600">
            <span>Page {page + 1} of {totalPages} · {total} total</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
                Previous
              </Button>
              <Button size="sm" variant="outline" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing?.id ? "Edit" : "New"} {config.singular}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <CrudForm
              fields={config.fields}
              value={editing}
              onChange={setEditing}
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              className="bg-[#E8651A] hover:bg-[#E8651A]/90"
              disabled={saveMut.isPending}
              onClick={() => {
                const payload: any = { ...editing };
                // Parse JSON fields
                config.fields.forEach((f) => {
                  if (f.type === "json") {
                    try {
                      payload[f.name] = typeof payload[f.name] === "string"
                        ? JSON.parse(payload[f.name] || "[]")
                        : payload[f.name];
                    } catch {
                      toast.error(`Invalid JSON in ${f.label}`);
                      throw new Error("invalid json");
                    }
                  }
                  if (f.type === "number") {
                    payload[f.name] = Number(payload[f.name] ?? 0);
                  }
                  if (f.name === "category" && typeof payload[f.name] === "string") {
                    payload[f.name] = payload[f.name].toLowerCase();
                  }
                });
                saveMut.mutate(payload);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

type CrudRowProps = {
  row: any;
  columns: CrudConfig["listColumns"];
  onEdit: (row: any) => void;
  onDelete: (id: string) => void;
};

const CrudRow = React.memo(function CrudRow({ row, columns, onEdit, onDelete }: CrudRowProps) {
  const handleEdit = React.useCallback(() => onEdit(row), [onEdit, row]);
  const handleDelete = React.useCallback(() => onDelete(row.id), [onDelete, row.id]);
  return (
    <tr className="border-b hover:bg-gray-50">
      {columns.map((c) => (
        <td key={c.name} className="p-3 align-middle">
          {c.render ? c.render(row) : String(row[c.name] ?? "")}
        </td>
      ))}
      <td className="p-3 text-right">
        <div className="inline-flex gap-1">
          <Button size="icon" variant="ghost" onClick={handleEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </td>
    </tr>
  );
});

function CrudForm({
  fields,
  value,
  onChange,
}: {
  fields: FieldDef[];
  value: any;
  onChange: (v: any) => void;
}) {
  const set = (k: string, v: any) => onChange({ ...value, [k]: v });

  return (
    <div className="space-y-4">
      {fields.filter((f) => !f.hidden).map((f) => (
        <div key={f.name}>
          <Label className="mb-1.5 block">{f.label}</Label>
          {f.type === "textarea" || f.type === "json" || f.type === "richtext" ? (
            <Textarea
              rows={f.rows ?? (f.type === "json" ? 6 : 4)}
              value={value[f.name] ?? ""}
              onChange={(e) => set(f.name, e.target.value)}
              placeholder={f.placeholder}
              className={f.type === "json" ? "font-mono text-xs" : ""}
            />
          ) : f.type === "boolean" ? (
            <div className="flex items-center gap-2">
              <Switch
                checked={!!value[f.name]}
                onCheckedChange={(v) => set(f.name, v)}
              />
              <span className="text-sm text-gray-500">{value[f.name] ? "Yes" : "No"}</span>
            </div>
          ) : f.type === "select" ? (
            <select
              className="w-full border rounded-md h-10 px-3 text-sm"
              value={value[f.name] ?? ""}
              onChange={(e) => set(f.name, e.target.value)}
            >
              <option value="">— select —</option>
              {f.options?.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          ) : f.type === "image" ? (
            <div className="space-y-2">
              <Input
                value={value[f.name] ?? ""}
                onChange={(e) => set(f.name, e.target.value)}
                placeholder="Image URL"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file || !f.bucket) return;
                  try {
                    const url = await uploadFile(f.bucket, file);
                    set(f.name, url);
                    toast.success("Uploaded");
                  } catch (err: any) {
                    toast.error(err.message || "Upload failed");
                  }
                }}
              />
              {value[f.name] && (
                <img src={value[f.name]} alt="" width={96} height={96} loading="lazy" decoding="async" className="h-24 w-24 object-cover rounded border" />
              )}
            </div>
          ) : (
            <Input
              type={f.type === "number" ? "number" : "text"}
              value={value[f.name] ?? ""}
              onChange={(e) => set(f.name, e.target.value)}
              placeholder={f.placeholder}
            />
          )}
          {f.helper && <p className="text-xs text-gray-500 mt-1">{f.helper}</p>}
        </div>
      ))}
    </div>
  );
}
