import * as React from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { canBootstrapAdmin } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/signup")({
  component: AdminSignup,
});

function AdminSignup() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [allowed, setAllowed] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    canBootstrapAdmin().then(setAllowed);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // sign up
    const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin + "/admin/login" },
    });
    if (signUpErr) {
      setError(signUpErr.message);
      setLoading(false);
      return;
    }

    // sign in immediately (in case email confirm is off)
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    if (signInErr) {
      setError(
        "Account created. Check your email to confirm, then return to /admin/login.",
      );
      setLoading(false);
      return;
    }

    // grant admin role (RLS allows it when admin_exists()=false and user_id=auth.uid())
    const userId = signUpData.user?.id;
    if (!userId) {
      setError("Could not determine user id.");
      setLoading(false);
      return;
    }
    const { error: roleErr } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });
    if (roleErr) {
      setError(`Could not grant admin: ${roleErr.message}`);
      setLoading(false);
      return;
    }
    navigate({ to: "/admin/dashboard" });
  };

  if (allowed === false) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Admin already exists</h2>
          <p className="text-sm text-gray-500 mb-4">
            An admin account has been created. Please log in instead.
          </p>
          <Link to="/admin/login" className="text-[#E8651A] font-medium hover:underline">
            Go to login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <p className="text-2xl font-bold">
            <span className="text-[#E8651A]">Rizdeen</span>{" "}
            <span className="text-[#0D0D0D]">Travels</span>
          </p>
          <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">
            Create First Admin
          </p>
        </div>
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2 mb-4">
          One-time bootstrap. This page locks itself after the first admin is created.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password (min 6 chars)</Label>
            <Input
              id="password"
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button
            type="submit"
            disabled={loading || allowed === null}
            className="w-full bg-[#E8651A] hover:bg-[#d05712] text-white"
          >
            {loading ? "Creating…" : "Create Admin Account"}
          </Button>
        </form>
      </div>
    </div>
  );
}
