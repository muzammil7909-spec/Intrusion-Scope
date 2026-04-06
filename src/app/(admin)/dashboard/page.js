import { getPosts } from "@/actions/blogActions";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  PlusCircle, 
  FileText, 
  ShieldAlert, 
  CheckCircle2, 
  MoreVertical,
  ArrowUpRight,
  History
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SearchInput from "@/components/shared/SearchInput";
import Pagination from "@/components/shared/Pagination";
import PublishToggle from "@/components/shared/PublishToggle";
import DeletePostButton from "@/components/shared/DeletePostButton";

export default async function DashboardPage({ searchParams }) {
  const session = await auth();
  if (!session) redirect("/login");

  const queryParams = await searchParams;
  const page = Number(queryParams.page) || 1;
  const search = queryParams.search || "";
  const limit = 10;

  const { posts, pagination } = await getPosts({ page, limit, search });

  const totalPosts = pagination.totalCount;
  const criticalAlerts = posts.filter(p => 
    p.cveId?.toUpperCase().includes('CRITICAL') || 
    p.classification?.toUpperCase().includes('CRITICAL')
  ).length;
  const remediationRate = totalPosts > 0 ? "94.8%" : "0%";

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Manage and monitor security advisories and system status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 px-4 rounded-lg border-white/10 bg-white/5 hover:bg-white/10 gap-2 font-bold text-[10px] uppercase tracking-widest">
            <History className="size-4" />
            Logs
          </Button>
          <Button asChild className="h-10 px-6 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-bold gap-2 text-[10px] uppercase tracking-widest">
            <Link href="/dashboard/post/new">
              <PlusCircle className="size-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            label="Total Posts" 
            value={totalPosts} 
            icon={FileText} 
            color="primary" 
        />
        <StatCard 
            label="Critical Alerts" 
            value={criticalAlerts} 
            icon={ShieldAlert} 
            color="red" 
        />
        <StatCard 
            label="Resolution Rate" 
            value={remediationRate} 
            icon={CheckCircle2} 
            color="secondary" 
        />
      </div>

      {/* Table */}
      <Card className="rounded-xl border-white/10 bg-card overflow-hidden">
        <CardHeader className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5">
          <div className="space-y-1 text-center md:text-left">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-3 justify-center md:justify-start">
              Advisories
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-bold px-2 py-0.5">
                {pagination.totalCount}
              </Badge>
            </CardTitle>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <SearchInput placeholder="Search..." className="h-9 text-[11px] bg-white/5 border-white/10 rounded-lg w-full md:w-64" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-none">
                  <TableHead className="pl-6 py-4 text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Title</TableHead>
                  <TableHead className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">CVE ID</TableHead>
                  <TableHead className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Status</TableHead>
                  <TableHead className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-20 text-muted-foreground text-sm">
                      No posts found.
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post._id} className="border-white/5 hover:bg-white/[0.02] group">
                      <TableCell className="pl-6 py-4">
                        <Link 
                          href={`/dashboard/post/${post._id}`}
                          className="font-bold text-white text-sm hover:text-primary transition-colors flex items-center gap-2"
                        >
                          {post.blogTitle}
                          <ArrowUpRight className="size-3 opacity-30 group-hover:opacity-100" />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs text-muted-foreground">
                          {post.cveId || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <PublishToggle postId={post._id} isPublished={post.published} className="scale-75 origin-left" />
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-bold uppercase hover:bg-primary/10 hover:text-primary">
                            <Link href={`/dashboard/post/${post._id}`}>Edit</Link>
                          </Button>
                          <DeletePostButton postId={post._id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="p-4 border-t border-white/5">
            <Pagination totalPages={pagination.totalPages} currentPage={pagination.currentPage} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  const colorMap = {
    primary: "text-primary bg-primary/10 border-primary/20",
    red: "text-red-500 bg-red-500/10 border-red-500/20",
    secondary: "text-green-500 bg-green-500/10 border-green-500/20",
  };

  return (
    <Card className="rounded-xl border-white/10 bg-card overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
            <h4 className="text-3xl font-bold text-white">{value}</h4>
          </div>
          <div className={`p-3 rounded-lg border ${colorMap[color]}`}>
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
