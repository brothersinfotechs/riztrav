import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Package, Inbox, Star, Image as ImageIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/dashboard")({
  component: Dashboard,
});

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  href,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-3xl font-bold text-[#0D0D0D]">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{label}</p>
        </div>
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <p className="text-xs text-[#E8651A] font-medium mt-3">View all →</p>
    </Link>
  );
}

function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [pkg, enq, tst, gal] = await Promise.all([
        supabase.from("packages").select("id", { count: "exact", head: true }),
        supabase.from("enquiries").select("id", { count: "exact", head: true }),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
        supabase.from("gallery_images").select("id", { count: "exact", head: true }),
      ]);
      return {
        packages: pkg.count ?? 0,
        enquiries: enq.count ?? 0,
        testimonials: tst.count ?? 0,
        gallery: gal.count ?? 0,
      };
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

  const { data: recent } = useQuery({
    queryKey: ["admin", "recent-enquiries"],
    queryFn: async () => {
      const { data } = await supabase
        .from("enquiries")
        .select("id,full_name,phone,package_name,created_at,status")
        .order("created_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
    staleTime: 60_000,
  });

  return (
    <>
      <AdminPageHeader title="Dashboard" description="Overview of your site activity" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Packages"
          value={stats?.packages ?? "—"}
          icon={Package}
          color="bg-[#E8651A]"
          href="/admin/packages"
        />
        <StatCard
          label="Total Enquiries"
          value={stats?.enquiries ?? "—"}
          icon={Inbox}
          color="bg-blue-500"
          href="/admin/enquiries"
        />
        <StatCard
          label="Testimonials"
          value={stats?.testimonials ?? "—"}
          icon={Star}
          color="bg-green-500"
          href="/admin/testimonials"
        />
        <StatCard
          label="Gallery Images"
          value={stats?.gallery ?? "—"}
          icon={ImageIcon}
          color="bg-purple-500"
          href="/admin/gallery"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#0D0D0D]">Recent Enquiries</h2>
          <Link to="/admin/enquiries" className="text-sm text-[#E8651A] hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Phone</th>
                <th className="py-2 px-3">Package</th>
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {(recent ?? []).map((e) => (
                <tr key={e.id} className="border-b last:border-0">
                  <td className="py-2 px-3 font-medium">{e.full_name}</td>
                  <td className="py-2 px-3">{e.phone}</td>
                  <td className="py-2 px-3">{e.package_name}</td>
                  <td className="py-2 px-3">
                    {new Date(e.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-3">
                    <StatusBadge status={e.status as string} />
                  </td>
                </tr>
              ))}
              {recent && recent.length === 0 && (
                <tr>
                  <td className="py-6 text-center text-gray-400" colSpan={5}>
                    No enquiries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild className="bg-[#E8651A] hover:bg-[#d05712] text-white gap-2">
          <Link to="/admin/packages">
            <Plus className="h-4 w-4" /> Add Package
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/admin/enquiries">View Enquiries</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/admin/gallery">Add Gallery Image</Link>
        </Button>
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-red-100 text-red-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-700",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] ?? "bg-gray-100"}`}>
      {status?.replace("_", " ") ?? "—"}
    </span>
  );
}
