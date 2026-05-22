import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({ component: Page });

type Settings = {
  id?: number;
  general?: { site_name?: string; tagline?: string; email?: string; phone?: string; address?: string; logo?: string };
  hero?: { title?: string; subtitle?: string; cta_text?: string; bg_image?: string };
  stats?: { years?: string; pilgrims?: string; trips?: string; rating?: string };
  social?: { facebook?: string; youtube?: string; whatsapp?: string; instagram?: string };
};

function Page() {
  const qc = useQueryClient();
  const { data: row } = useQuery({
    queryKey: ["admin", "site_settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      return data as Settings | null;
    },
  });

  const [s, setS] = React.useState<Settings>({});
  React.useEffect(() => {
    if (row) setS(row);
  }, [row]);

  const saveMut = useMutation({
    mutationFn: async () => {
      const payload = { id: 1, general: s.general || {}, hero: s.hero || {}, stats: s.stats || {}, social: s.social || {} };
      const { error } = await supabase.from("site_settings").upsert(payload, { onConflict: "id" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "site_settings"] });
      qc.invalidateQueries({ queryKey: ["pub", "site_settings"] });
      toast.success("Settings saved");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const update = (section: keyof Settings, key: string, value: string) => {
    setS({ ...s, [section]: { ...(s[section] as any), [key]: value } });
  };

  const F = ({ section, fieldKey, label, type = "text", rows }: { section: keyof Settings; fieldKey: string; label: string; type?: string; rows?: number }) => (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      {rows ? (
        <Textarea rows={rows} value={(s[section] as any)?.[fieldKey] ?? ""} onChange={(e) => update(section, fieldKey, e.target.value)} />
      ) : (
        <Input type={type} value={(s[section] as any)?.[fieldKey] ?? ""} onChange={(e) => update(section, fieldKey, e.target.value)} />
      )}
    </div>
  );

  return (
    <>
      <AdminPageHeader
        title="Site Settings"
        description="Manage global site content"
        action={
          <Button onClick={() => saveMut.mutate()} disabled={saveMut.isPending} className="bg-[#E8651A] hover:bg-[#E8651A]/90">
            Save Settings
          </Button>
        }
      />

      <div className="bg-white rounded-xl shadow-sm p-6">
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <F section="general" fieldKey="site_name" label="Site Name" />
            <F section="general" fieldKey="tagline" label="Tagline" />
            <F section="general" fieldKey="email" label="Contact Email" />
            <F section="general" fieldKey="phone" label="Contact Phone" />
            <F section="general" fieldKey="address" label="Address" rows={2} />
            <F section="general" fieldKey="logo" label="Logo URL" />
          </TabsContent>

          <TabsContent value="hero" className="space-y-4 mt-4">
            <F section="hero" fieldKey="title" label="Hero Title" />
            <F section="hero" fieldKey="subtitle" label="Hero Subtitle" rows={2} />
            <F section="hero" fieldKey="cta_text" label="CTA Button Text" />
            <F section="hero" fieldKey="bg_image" label="Background Image URL" />
          </TabsContent>

          <TabsContent value="stats" className="space-y-4 mt-4">
            <F section="stats" fieldKey="years" label="Years of Experience" />
            <F section="stats" fieldKey="pilgrims" label="Pilgrims Served" />
            <F section="stats" fieldKey="trips" label="Successful Trips" />
            <F section="stats" fieldKey="rating" label="Rating" />
          </TabsContent>

          <TabsContent value="social" className="space-y-4 mt-4">
            <F section="social" fieldKey="facebook" label="Facebook URL" />
            <F section="social" fieldKey="youtube" label="YouTube URL" />
            <F section="social" fieldKey="whatsapp" label="WhatsApp Number" />
            <F section="social" fieldKey="instagram" label="Instagram URL" />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
