import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/admin/downloads")({ component: Page });

function Page() {
  return (
    <CrudPage
      config={{
        table: "downloads",
        title: "Downloads",
        description: "Manage downloadable resources",
        singular: "Download",
        listColumns: [
          { name: "title", label: "Title" },
          { name: "file_type", label: "Type" },
          { name: "is_active", label: "Active", render: (r) => (r.is_active ? "✓" : "—") },
        ],
        fields: [
          { name: "title", label: "Title", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "file_url", label: "File URL", type: "text", placeholder: "https://..." },
          {
            name: "file_type",
            label: "File Type",
            type: "select",
            options: [
              { label: "PDF", value: "PDF" },
              { label: "DOC", value: "DOC" },
              { label: "Image", value: "IMG" },
              { label: "Other", value: "OTHER" },
            ],
            defaultValue: "PDF",
          },
          { name: "is_active", label: "Active", type: "boolean", defaultValue: true },
        ],
      }}
    />
  );
}
