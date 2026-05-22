import * as React from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { canBootstrapAdmin, userHasAdminRole } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [canBootstrap, setCanBootstrap] = React.useState(false);

  React.useEffect(() => {
    canBootstrapAdmin().then(setCanBootstrap);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const emailValue = email.trim();
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: emailValue,
      password,
    });
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    const signedInUserId = data.user?.id;
    const isAdmin = signedInUserId ? await userHasAdminRole(signedInUserId) : false;
    if (!isAdmin) {
      setError("This account does not have admin access.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }
    navigate({ to: "/admin/dashboard", replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <p className="text-2xl font-bold">
            <span className="text-[#E8651A]">Rizdeen</span>{" "}
            <span className="text-[#0D0D0D]">Travels</span>
          </p>
          <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">Admin Login</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E8651A] hover:bg-[#d05712] text-white"
          >
            {loading ? "Signing in…" : "Login"}
          </Button>
        </form>

        {canBootstrap && (
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-xs text-gray-500 mb-2">No admin yet?</p>
            <Link
              to="/admin/signup"
              className="text-sm font-medium text-[#E8651A] hover:underline"
            >
              Create the first admin account →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
