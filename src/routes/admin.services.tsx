import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/admin/services")({ component: Page });

function Page() {
  return (
    <CrudPage
      config={{
        table: "services",
        title: "Services",
        description: "Manage services shown on the homepage",
        singular: "Service",
        orderBy: { column: "sort_order", ascending: true },
        listColumns: [
          { name: "name", label: "Name" },
          { name: "icon", label: "Icon" },
          { name: "is_active", label: "Active", render: (r) => (r.is_active ? "✓" : "—") },
        ],
        fields: [
          { name: "name", label: "Name", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
          {
            name: "icon",
            label: "Icon",
            type: "select",
            options: [
              { label: "Briefcase", value: "briefcase" },
              { label: "Moon/Umrah", value: "moon" },
              { label: "Ticket", value: "ticket" },
              { label: "File Check", value: "filecheck" },
              { label: "Car", value: "car" },
              { label: "Globe", value: "globe" },
            ],
          },
          { name: "bg_color", label: "Background Color (hex)", type: "text", placeholder: "#FFF8F2" },
          { name: "sub_services", label: "Sub-services (JSON array of strings)", type: "json", defaultValue: "[]" },
          { name: "sort_order", label: "Sort Order", type: "number", defaultValue: 0 },
          { name: "is_active", label: "Active", type: "boolean", defaultValue: true },
        ],
      }}
    />
  );
}
