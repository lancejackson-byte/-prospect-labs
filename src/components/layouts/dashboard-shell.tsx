import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { createClient } from "@/lib/supabase/server";

interface DashboardShellProps {
  children: React.ReactNode;
}

export async function DashboardShell({ children }: DashboardShellProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-64 flex flex-1 flex-col">
        <Header
          userEmail={user?.email}
          userAvatar={user?.user_metadata?.avatar_url}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
