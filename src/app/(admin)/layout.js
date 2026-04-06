import Link from "next/link";
import { 
  auth, 
  signOut 
} from "@/lib/auth";
import { 
  LayoutDashboard, 
  Users, 
  Globe, 
  LogOut, 
  Settings, 
  PlusCircle,
  ShieldCheck,
  ChevronsUpDown,
  User
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function AdminLayout({ children }) {
  const session = await auth();

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen bg-background text-foreground w-full overflow-hidden">
          {/* Main Sidebar */}
          <Sidebar collapsible="icon" className="border-r border-white/5 bg-card">
            <SidebarHeader className="p-4">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    size="lg"
                    className="hover:bg-primary/5 group flex items-center gap-3"
                    asChild
                  >
                    <Link href="/dashboard">
                      <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-secondary text-primary border border-primary/10">
                        <ShieldCheck className="size-6" />
                      </div>
                      <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                        <span className="font-bold tracking-tight text-white text-sm">Admin Panel</span>
                        <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Management</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2 py-4">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Dashboard"
                    className="hover:bg-primary/5 hover:text-primary rounded-xl px-4 py-6 flex items-center gap-3"
                    asChild
                  >
                    <Link href="/dashboard">
                      <LayoutDashboard className="size-4.5" />
                      <span className="font-bold uppercase tracking-widest text-[10px]">Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="New Post"
                    className="hover:bg-primary/5 hover:text-primary rounded-xl px-4 py-6 flex items-center gap-3"
                    asChild
                  >
                    <Link href="/dashboard/post/new">
                      <PlusCircle className="size-4.5" />
                      <span className="font-bold uppercase tracking-widest text-[10px]">New Post</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Users"
                    className="hover:bg-primary/5 hover:text-primary rounded-xl px-4 py-6 flex items-center gap-3"
                    asChild
                  >
                    <Link href="/dashboard/users">
                      <Users className="size-4.5" />
                      <span className="font-bold uppercase tracking-widest text-[10px]">Users</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Public Site"
                    className="hover:bg-primary/5 hover:text-primary rounded-xl px-4 py-6 flex items-center gap-3"
                    asChild
                  >
                    <Link href="/">
                      <Globe className="size-4.5" />
                      <span className="font-bold uppercase tracking-widest text-[10px]">Public Site</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>

            {session?.user && (
              <SidebarFooter className="p-4">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                          size="lg"
                          className="hover:bg-white/5 rounded-2xl p-3 border border-white/5 transition-all outline-none"
                        >
                          <Avatar className="h-9 w-9 rounded-xl border border-primary/20">
                            <AvatarImage src={session.user.image} alt={session.user.email} />
                            <AvatarFallback className="rounded-xl bg-secondary text-primary font-bold text-xs uppercase flex items-center justify-center">
                              {session.user.email?.[0] || "A"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid flex-1 text-left text-xs leading-tight group-data-[collapsible=icon]:hidden px-1">
                            <span className="truncate font-bold text-white/90">{session.user.email}</span>
                            <span className="truncate text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Administrator</span>
                          </div>
                          <ChevronsUpDown className="ml-auto size-4 opacity-40 group-data-[collapsible=icon]:hidden" />
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-2xl bg-card border-white/10 text-foreground"
                        side="top"
                        align="end"
                        sideOffset={8}
                      >
                        <DropdownMenuGroup>
                          <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                              <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={session.user.image} alt={session.user.email} />
                                <AvatarFallback className="rounded-lg bg-secondary text-primary font-bold text-[10px] uppercase flex items-center justify-center">
                                  {session.user.email?.[0] || "A"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="grid flex-1 text-left text-xs leading-tight">
                                <span className="truncate font-bold">{session.user.name || session.user.email}</span>
                                <span className="truncate text-[10px] text-muted-foreground">{session.user.email}</span>
                              </div>
                            </div>
                          </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuGroup>
                          <DropdownMenuItem className="hover:bg-white/5 hover:text-primary rounded-lg py-2.5">
                            <User className="mr-2 size-4" />
                            Account
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-white/5" />
                        <form action={async () => {
                          "use server";
                          await signOut();
                        }}>
                          <DropdownMenuItem 
                            className="hover:bg-red-500/10 hover:text-red-500 rounded-lg py-2.5 cursor-pointer"
                            asChild
                          >
                            <button type="submit" className="w-full flex items-center">
                              <LogOut className="mr-2 size-4" />
                              Sign Out
                            </button>
                          </DropdownMenuItem>
                        </form>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            )}
          </Sidebar>

          {/* Main Inset Content */}
          <SidebarInset className="bg-background flex flex-col relative w-full h-screen overflow-hidden">
            <header className="flex h-16 shrink-0 items-center justify-between px-8 border-b border-white/5 bg-background sticky top-0 z-40">
              <div className="flex items-center gap-6">
                <SidebarTrigger className="-ml-1 h-9 w-9 rounded-xl border border-white/5 hover:bg-white/5 hover:text-primary hover:border-primary/20 transition-all" />
                <Separator orientation="vertical" className="mr-2 h-4 opacity-10" />
                <Breadcrumb className="group-data-[collapsible=icon]:hidden">
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-colors">
                        ADMIN
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block opacity-20" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">DASHBOARD</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto custom-scrollbar p-10 lg:p-14 max-w-[1600px] mx-auto w-full">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
