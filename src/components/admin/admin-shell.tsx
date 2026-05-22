import * as React from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  Image as ImageIcon,
  Star,
  Users,
  Wrench,
  HelpCircle,
  Inbox,
  FileText,
  Download,
  Settings,
  LogOut,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/packages", label: "Packages", icon: Package },
  { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/admin/testimonials", label: "Testimonials", icon: Star },
  { to: "/admin/team", label: "Team", icon: Users },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { to: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { to: "/admin/blog", label: "Blog", icon: FileText },
  { to: "/admin/downloads", label: "Downloads", icon: Download },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <aside className="fixed inset-y-0 left-0 w-[260px] bg-[#0D0D0D] text-white flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <Link to="/" className="block">
            <span className="text-xl font-bold text-[#E8651A]">Rizdeen</span>
            <span className="text-xl font-bold text-white"> Travels</span>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Admin Panel</p>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#E8651A] text-white"
                    : "text-white/70 hover:bg-[#E8651A]/15 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 ml-[260px]">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 sticky top-0 z-10">
          <h1 className="font-semibold text-[#0D0D0D]">Welcome, Admin</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0D0D0D]">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}
