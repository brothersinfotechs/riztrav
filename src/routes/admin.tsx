import * as React from "react";
import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const PUBLIC_PATHS = ["/admin/login", "/admin/signup"];

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [status, setStatus] = React.useState<"checking" | "ok">("checking");

  const isPublic = PUBLIC_PATHS.includes(pathname);

  React.useEffect(() => {
    let mounted = true;
    if (isPublic) {
      setStatus("ok");
      return;
    }
    setStatus("checking");
    (async () => {
      const { isAdmin } = await getCurrentAdmin();
      if (!mounted) return;
      if (!isAdmin) navigate({ to: "/admin/login" });
      else setStatus("ok");
    })();
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted || session) return;
      if (!PUBLIC_PATHS.includes(window.location.pathname)) {
        navigate({ to: "/admin/login", replace: true });
      }
    });
    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [pathname, isPublic, navigate]);

  if (isPublic) return <Outlet />;

  if (status !== "ok") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <p className="text-sm text-gray-500">Loading admin…</p>
      </div>
    );
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
