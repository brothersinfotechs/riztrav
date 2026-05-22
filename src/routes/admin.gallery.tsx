import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/admin/gallery")({ component: Page });

function Page() {
  return (
    <CrudPage
      config={{
        table: "gallery_images",
        title: "Gallery",
        description: "Manage gallery images",
        singular: "Image",
        orderBy: { column: "sort_order", ascending: true },
        listColumns: [
          { name: "image_url", label: "Image", render: (r) => <img src={r.image_url} alt="" className="h-12 w-16 object-cover rounded" /> },
          { name: "caption", label: "Caption" },
          { name: "category", label: "Category" },
          { name: "is_active", label: "Active", render: (r) => (r.is_active ? "✓" : "—") },
        ],
        fields: [
          { name: "image_url", label: "Image", type: "image", bucket: "gallery" },
          { name: "caption", label: "Caption", type: "text" },
          {
            name: "category",
            label: "Category",
            type: "select",
            options: [
              { label: "Hajj", value: "hajj" },
              { label: "Umrah", value: "umrah" },
              { label: "Ziyarah", value: "ziyarah" },
              { label: "Group", value: "group" },
              { label: "Other", value: "other" },
            ],
          },
          { name: "sort_order", label: "Sort Order", type: "number", defaultValue: 0 },
          { name: "is_active", label: "Active", type: "boolean", defaultValue: true },
        ],
      }}
    />
  );
}
