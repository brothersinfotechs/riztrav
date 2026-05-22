import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/admin/testimonials")({ component: Page });

function Page() {
  return (
    <CrudPage
      config={{
        table: "testimonials",
        title: "Testimonials",
        description: "Approve and manage customer reviews",
        singular: "Testimonial",
        listColumns: [
          { name: "name", label: "Name" },
          { name: "location", label: "Location" },
          { name: "category", label: "Category" },
          { name: "rating", label: "Rating", render: (r) => "★".repeat(r.rating) },
          { name: "is_approved", label: "Approved", render: (r) => (r.is_approved ? "✓" : "Pending") },
        ],
        fields: [
          { name: "name", label: "Name", type: "text" },
          { name: "location", label: "Location", type: "text" },
          { name: "avatar_url", label: "Avatar", type: "image", bucket: "testimonials" },
          { name: "review", label: "Review", type: "textarea", rows: 6 },
          { name: "rating", label: "Rating (1-5)", type: "number", defaultValue: 5 },
          {
            name: "category",
            label: "Category",
            type: "select",
            options: [
              { label: "Hajj", value: "hajj" },
              { label: "Umrah", value: "umrah" },
            ],
          },
          { name: "is_approved", label: "Approved (visible on site)", type: "boolean" },
        ],
      }}
    />
  );
}
