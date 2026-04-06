import { getAdmin, createAdmin, updateAdmin } from "@/actions/adminActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { 
  ShieldCheck, 
  Save, 
  ArrowLeft, 
  Mail, 
  Lock, 
  ChevronRight,
  Info
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function AdminEditorPage({ params }) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  let admin = null;
  if (id !== "new") {
    admin = await getAdmin(id);
    if (!admin) redirect("/dashboard/users");
  }

  const isEditing = id !== "new";

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-32">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/users" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary">
              Users
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="size-3" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-xs font-bold uppercase tracking-widest text-primary">
              {isEditing ? "Edit User" : "New User"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {isEditing ? "Edit User" : "Add User"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isEditing ? "Modify user credentials and access." : "Create a new administrative user."}
          </p>
        </div>
        <Button variant="outline" asChild className="h-10 px-4 rounded-lg border-white/10 bg-white/5 hover:bg-white/10 font-bold text-[10px] uppercase tracking-widest gap-2">
          <Link href="/dashboard/users">
            <ArrowLeft className="size-4" />
            Back to Users
          </Link>
        </Button>
      </div>

      <form 
        action={async (formData) => {
          "use server";
          const result = isEditing 
            ? await updateAdmin(id, formData) 
            : await createAdmin(formData);
          
          if (result.success) {
            redirect("/dashboard/users");
          }
        }} 
        className="space-y-8"
      >
        <Card className="rounded-xl border-white/10 bg-card">
          <CardHeader className="p-6 border-b border-white/5">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
              <ShieldCheck className="size-5 text-primary" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                <Input 
                  name="email" 
                  type="email"
                  defaultValue={admin?.email} 
                  required 
                  placeholder="name@example.com" 
                  className="h-11 pl-12 bg-white/5 border-white/10 focus-visible:ring-primary/40 rounded-lg text-sm font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                <Input 
                  name="password" 
                  type="password"
                  placeholder={isEditing ? "Leave blank to keep current password" : "••••••••"} 
                  required={!isEditing}
                  className="h-11 pl-12 bg-white/5 border-white/10 focus-visible:ring-primary/40 rounded-lg text-sm font-bold"
                />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/5 border border-white/5 flex gap-3 shadow-inner">
               <Info className="size-4 text-primary shrink-0" />
               <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Passwords must be at least 12 characters long and include a mix of uppercase, lowercase, and numbers for maximum security.
               </p>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full h-12 rounded-lg font-bold text-[12px] uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
          <Save className="size-4 mr-2" />
          Save User
        </Button>
      </form>
    </div>
  );
}
