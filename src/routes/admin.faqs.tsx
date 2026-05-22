import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

export const Route = createFileRoute("/admin/faqs")({ component: Page });

function Page() {
  return (
    <CrudPage
      config={{
        table: "faqs",
        title: "FAQs",
        description: "Manage frequently asked questions",
        singular: "FAQ",
        orderBy: { column: "sort_order", ascending: true },
        listColumns: [
          { name: "question", label: "Question" },
          { name: "category", label: "Category" },
          { name: "is_active", label: "Active", render: (r) => (r.is_active ? "✓" : "—") },
        ],
        fields: [
          { name: "question", label: "Question", type: "text" },
          { name: "answer", label: "Answer", type: "textarea", rows: 5 },
          {
            name: "category",
            label: "Category",
            type: "select",
            options: [
              { label: "General", value: "general" },
              { label: "Hajj", value: "hajj" },
              { label: "Umrah", value: "umrah" },
              { label: "Payment", value: "payment" },
              { label: "Visa", value: "visa" },
            ],
          },
          { name: "sort_order", label: "Sort Order", type: "number", defaultValue: 0 },
          { name: "is_active", label: "Active", type: "boolean", defaultValue: true },
        ],
      }}
    />
  );
}
