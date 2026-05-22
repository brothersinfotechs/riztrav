import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download as DownloadIcon } from "lucide-react";
import * as React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export const Route = createFileRoute("/admin/enquiries")({
  component: EnquiriesAdmin,
});

const STATUSES = ["new", "in_progress", "confirmed", "closed"] as const;

const PAGE_SIZE = 20;
const ENQ_COLS = "id,full_name,phone,email,package_name,persons,preferred_date,status,message,created_at";

function EnquiriesAdmin() {
  const qc = useQueryClient();
  const [filter, setFilter] = React.useState<string>("all");
  const [page, setPage] = React.useState(0);

  React.useEffect(() => { setPage(0); }, [filter]);

  const { data } = useQuery({
    queryKey: ["admin", "enquiries", filter, page],
    queryFn: async () => {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      let q = supabase.from("enquiries").select(ENQ_COLS, { count: "exact" })
        .order("created_at", { ascending: false });
      if (filter !== "all") q = q.eq("status", filter);
      const { data, count } = await q.range(from, to);
      return { rows: data ?? [], count: count ?? 0 };
    },
    staleTime: 30_000,
  });

  const rows = data?.rows ?? [];
  const total = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "enquiries"] }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("enquiries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "enquiries"] }),
  });

  const exportCsv = React.useCallback(async () => {
    let q = supabase.from("enquiries").select(ENQ_COLS).order("created_at", { ascending: false }).limit(5000);
    if (filter !== "all") q = q.eq("status", filter);
    const { data: all } = await q;
    if (!all) return;
    const headers = ["Name", "Phone", "Email", "Package", "Persons", "Date", "Status", "Message"];
    const csvRows = all.map((e: any) => [
      e.full_name, e.phone, e.email ?? "", e.package_name,
      e.persons ?? "", e.preferred_date ?? "", e.status, (e.message ?? "").replace(/\n/g, " "),
    ]);
    const csv = [headers, ...csvRows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filter]);

  return (
    <>
      <AdminPageHeader
        title="Enquiries"
        description="All package enquiries submitted via the site"
        action={
          <div className="flex gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={exportCsv} className="bg-[#E8651A] hover:bg-[#d05712] text-white gap-2">
              <DownloadIcon className="h-4 w-4" /> Export CSV
            </Button>
          </div>
        }
      />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500 bg-gray-50 border-b">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Package</th>
              <th className="py-3 px-4">Persons</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} className="border-b last:border-0 align-top">
                <td className="py-3 px-4">
                  <div className="font-medium">{e.full_name}</div>
                  {e.message && <div className="text-xs text-gray-500 mt-1 max-w-xs">{e.message}</div>}
                </td>
                <td className="py-3 px-4 text-xs">
                  <div>{e.phone}</div>
                  {e.email && <div className="text-gray-500">{e.email}</div>}
                </td>
                <td className="py-3 px-4">{e.package_name}</td>
                <td className="py-3 px-4">{e.persons ?? "—"}</td>
                <td className="py-3 px-4 text-xs">{new Date(e.created_at).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <Select value={e.status as string} onValueChange={(v) => setStatus.mutate({ id: e.id, status: v })}>
                    <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-3 px-4">
                  <Button variant="outline" size="sm" onClick={() => {
                    if (confirm("Delete this enquiry?")) del.mutate(e.id);
                  }}>Delete</Button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td className="py-8 text-center text-gray-400" colSpan={7}>No enquiries.</td></tr>
            )}
          </tbody>
        </table>
        {total > PAGE_SIZE && (
          <div className="flex items-center justify-between p-3 border-t text-sm text-gray-600">
            <span>Page {page + 1} of {totalPages} · {total} total</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Previous</Button>
              <Button size="sm" variant="outline" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
