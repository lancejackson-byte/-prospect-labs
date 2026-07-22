import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Mail, Users, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get workspace info
  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id, role")
    .eq("user_id", user?.id || "")
    .single();

  const workspaceId = membership?.workspace_id;

  // Fetch stats in parallel
  const [leadsCount, campaignsCount, oppsCount] = await Promise.all([
    workspaceId
      ? supabase.from("leads").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId)
      : Promise.resolve({ count: 0 }),
    workspaceId
      ? supabase.from("campaigns").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId)
      : Promise.resolve({ count: 0 }),
    workspaceId
      ? supabase.from("crm_opportunities").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId)
      : Promise.resolve({ count: 0 }),
  ]);

  const stats = [
    {
      title: "Total Leads",
      value: (leadsCount as { count: number }).count || 0,
      icon: Search,
      description: "Leads in your database",
    },
    {
      title: "Active Campaigns",
      value: (campaignsCount as { count: number }).count || 0,
      icon: Mail,
      description: "Running email campaigns",
    },
    {
      title: "Open Deals",
      value: (oppsCount as { count: number }).count || 0,
      icon: Users,
      description: "Active opportunities",
    },
    {
      title: "Pipeline Value",
      value: "$0",
      icon: TrendingUp,
      description: "Total deal value",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}! Here&apos;s your overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No recent activity yet. Start by searching for leads or creating a campaign.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
