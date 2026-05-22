import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/admin/packages")({ component: Page });

function Page() {
  return (
    <CrudPage
      config={{
        table: "packages",
        title: "Packages",
        description: "Manage Hajj & Umrah packages",
        singular: "Package",
        orderBy: { column: "sort_order", ascending: true },
        listColumns: [
          { name: "name", label: "Name" },
          { name: "type", label: "Type" },
          { name: "price", label: "Price" },
          { name: "duration", label: "Duration" },
          {
            name: "is_active",
            label: "Active",
            render: (r) => (r.is_active ? "✓" : "—"),
          },
          {
            name: "is_featured",
            label: "Featured",
            render: (r) => (r.is_featured ? "★" : "—"),
          },
        ],
        fields: [
          { name: "name", label: "Name", type: "text" },
          { name: "slug", label: "Slug", type: "text", helper: "URL-friendly identifier" },
          {
            name: "type",
            label: "Type",
            type: "select",
            options: [
              { label: "HAJJ", value: "HAJJ" },
              { label: "UMRAH", value: "UMRAH" },
            ],
          },
          { name: "price", label: "Price", type: "text", placeholder: "৳1,45,000" },
          { name: "duration", label: "Duration", type: "text", placeholder: "10 Days" },
          { name: "image", label: "Cover Image", type: "image", bucket: "gallery" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "highlights", label: "Highlights (JSON array of strings)", type: "json", defaultValue: "[]" },
          { name: "includes", label: "Includes (JSON array)", type: "json", defaultValue: "[]" },
          { name: "excludes", label: "Excludes (JSON array)", type: "json", defaultValue: "[]" },
          { name: "itinerary", label: "Itinerary (JSON: [{day,title,desc}])", type: "json", defaultValue: "[]" },
          { name: "faqs", label: "FAQs (JSON: [{q,a}])", type: "json", defaultValue: "[]" },
          { name: "sort_order", label: "Sort Order", type: "number", defaultValue: 0 },
          { name: "is_featured", label: "Featured (Most Popular badge)", type: "boolean" },
          { name: "is_active", label: "Active (visible on site)", type: "boolean", defaultValue: true },
        ],
      }}
    />
  );
}
