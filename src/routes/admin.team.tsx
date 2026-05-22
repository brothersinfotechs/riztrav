import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/admin/team")({ component: Page });

function Page() {
  return (
    <CrudPage
      config={{
        table: "team_members",
        title: "Team Members",
        description: "Manage team profiles",
        singular: "Team Member",
        orderBy: { column: "sort_order", ascending: true },
        listColumns: [
          { name: "photo_url", label: "Photo", render: (r) => r.photo_url ? <img src={r.photo_url} className="h-12 w-12 rounded-full object-cover" alt="" /> : "—" },
          { name: "name", label: "Name" },
          { name: "role", label: "Role" },
          { name: "is_active", label: "Active", render: (r) => (r.is_active ? "✓" : "—") },
        ],
        fields: [
          { name: "name", label: "Name", type: "text" },
          { name: "role", label: "Role", type: "text" },
          { name: "bio", label: "Bio", type: "textarea" },
          { name: "photo_url", label: "Photo", type: "image", bucket: "team" },
          { name: "sort_order", label: "Sort Order", type: "number", defaultValue: 0 },
          { name: "is_active", label: "Active", type: "boolean", defaultValue: true },
        ],
      }}
    />
  );
}
