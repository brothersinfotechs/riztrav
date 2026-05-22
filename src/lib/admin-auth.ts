import { supabase } from "@/integrations/supabase/client";

export async function userHasAdminRole(userId: string) {
  const { data: roles, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) return false;
  return !!roles?.some((r) => r.role === "admin");
}

export async function getCurrentAdmin() {
  const { data: userRes } = await supabase.auth.getUser();
  if (!userRes?.user) return { user: null, isAdmin: false };
  const isAdmin = await userHasAdminRole(userRes.user.id);
  return { user: userRes.user, isAdmin };
}

export async function canBootstrapAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc("can_bootstrap_admin");
  if (error) return false;
  return !!data;
}
