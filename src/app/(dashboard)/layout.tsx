import { createClient } from "@/lib/supabase/server";
import { TourShell } from "@/components/tour/tour-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <TourShell
      userId={user?.id}
      userEmail={user?.email}
      userAvatar={user?.user_metadata?.avatar_url}
    >
      {children}
    </TourShell>
  );
}
