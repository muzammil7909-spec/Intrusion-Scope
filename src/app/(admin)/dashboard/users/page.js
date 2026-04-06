import { getAdmins, deleteAdmin } from "@/actions/adminActions";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  UserPlus, 
  ShieldCheck, 
  Edit3, 
  MoreVertical,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function UsersListPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const admins = await getAdmins();

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-white">Users</h2>
          <p className="text-sm text-muted-foreground">
            Manage administrative users and their access levels.
          </p>
        </div>
        <Button asChild className="h-10 px-6 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-bold gap-2 text-[10px] uppercase tracking-widest">
          <Link href="/dashboard/users/new">
            <UserPlus className="size-4" />
            Add User
          </Link>
        </Button>
      </div>

      {/* Users Table Card */}
      <Card className="rounded-xl border-white/10 bg-card overflow-hidden">
        <CardHeader className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-3">
              Administrators
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-bold px-2 py-0.5">
                {admins.length}
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-none">
                  <TableHead className="pl-6 py-4 text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Identity</TableHead>
                  <TableHead className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Role</TableHead>
                  <TableHead className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Joined</TableHead>
                  <TableHead className="text-right pr-6 text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-20 text-muted-foreground text-sm">
                      No administrative users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map((admin) => (
                    <TableRow key={admin._id} className="border-white/5 hover:bg-white/[0.02] group">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-primary/20">
                            <ShieldCheck className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-sm">
                                {admin.email}
                            </span>
                            {admin.email === process.env.ADMIN_EMAIL && (
                              <span className="text-[8px] font-bold uppercase tracking-widest text-primary">Root</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                          <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-primary/20 bg-primary/5 text-primary py-0 px-2 h-4">
                            Admin
                          </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                            {new Date(admin.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-bold uppercase hover:bg-primary/10 hover:text-primary gap-2">
                            <Link href={`/dashboard/users/${admin._id}`}>
                              <Edit3 className="size-3" />
                              Edit
                            </Link>
                          </Button>
                          <form action={async () => {
                            "use server";
                            if (admin.email === process.env.ADMIN_EMAIL) return;
                            await deleteAdmin(admin._id);
                          }}>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              disabled={admin.email === process.env.ADMIN_EMAIL}
                              className="size-8 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 disabled:opacity-20"
                            >
                              <MoreVertical className="size-4" />
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
