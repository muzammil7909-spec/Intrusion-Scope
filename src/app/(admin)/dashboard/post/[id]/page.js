import { getPostUncached, createPost, updatePost } from "@/actions/blogActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  Save,
  ArrowLeft,
  FileText,
  HelpCircle,
  Hash,
  ChevronRight,
  Info,
  Settings,
  Globe
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
import { Checkbox } from "@/components/ui/checkbox";

export default async function PostEditorPage({ params }) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  let post = null;
  if (id !== "new") {
    post = await getPostUncached(id);
    if (!post) redirect("/dashboard");
  }

  const isEditing = id !== "new";

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="size-3" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-xs font-bold uppercase tracking-widest text-primary">
              {isEditing ? "Edit Post" : "New Post"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {isEditing ? "Edit Post" : "New Post"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isEditing ? "Modify your post details and settings." : "Create a new post for the advisory portal."}
          </p>
        </div>
        <Button variant="outline" asChild className="h-10 px-4 rounded-lg border-white/10 bg-white/5 hover:bg-white/10 font-bold text-[10px] uppercase tracking-widest gap-2">
          <Link href="/dashboard">
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <form
        action={async (formData) => {
          "use server";
          const result = isEditing
            ? await updatePost(id, formData)
            : await createPost(formData);

          if (result.success) {
            redirect("/dashboard");
          }
        }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="rounded-xl border-white/10 bg-card">
            <CardHeader className="p-6 border-b border-white/5">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
                <FileText className="size-5 text-primary" />
                Post Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Title</label>
                <Input
                  name="blogTitle"
                  defaultValue={post?.blogTitle}
                  required
                  placeholder="Post Title"
                  className="h-11 bg-white/5 border-white/10 focus-visible:ring-primary/40 rounded-lg text-sm font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Summary (Short Description)</label>
                <Textarea
                  name="shortDescription"
                  defaultValue={post?.shortDescription}
                  required
                  placeholder="A high-level summary of the post..."
                  className="min-h-[100px] bg-white/5 border-white/10 focus-visible:ring-primary/40 rounded-lg resize-none text-sm leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Full Content</label>
                <Textarea
                  name="data"
                  defaultValue={post?.data}
                  required
                  placeholder="The detailed technical content of the post..."
                  className="min-h-[300px] bg-white/5 border-white/10 focus-visible:ring-primary/40 rounded-lg resize-none text-sm leading-relaxed font-mono"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Product</label>
                  <Input
                    name="product"
                    defaultValue={post?.product}
                    placeholder="Product Name"
                    className="h-10 bg-white/5 border-white/10 rounded-lg text-xs font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Vendor</label>
                  <Input
                    name="vendorProject"
                    defaultValue={post?.vendorProject}
                    placeholder="Vendor Name"
                    className="h-10 bg-white/5 border-white/10 rounded-lg text-xs font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Category</label>
                  <Input
                    name="classification"
                    defaultValue={post?.classification}
                    placeholder="e.g. Zero-Day"
                    className="h-10 bg-white/5 border-white/10 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration Card */}
          <Card className="rounded-xl border-white/10 bg-card">
            <CardHeader className="p-6 border-b border-white/5">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
                <Settings className="size-5 text-primary" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Slug (URL path)</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40" />
                  <Input
                    name="slug"
                    defaultValue={post?.slug}
                    placeholder="post-url-slug"
                    className="h-10 pl-10 bg-white/5 border-white/10 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">CWEs (comma-separated)</label>
                  <Input
                    name="cwes"
                    defaultValue={post?.cwes?.join(", ")}
                    placeholder="CWE-79, CWE-89..."
                    className="h-10 bg-white/5 border-white/10 rounded-lg text-xs font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Keywords (comma-separated)</label>
                  <Input
                    name="keywords"
                    defaultValue={post?.keywords?.join(", ")}
                    placeholder="security, zero-day, exploit..."
                    className="h-10 bg-white/5 border-white/10 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Q&A Section */}
          <Card className="rounded-xl border-white/10 bg-card">
            <CardHeader className="p-6 border-b border-white/5">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
                <HelpCircle className="size-5 text-primary" />
                FAQ
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Question</label>
                <Input
                  name="faq_question"
                  defaultValue={post?.faq?.[0]?.question}
                  placeholder="Frequently asked question..."
                  className="h-10 bg-white/5 border-white/10 rounded-lg text-xs font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Answer</label>
                <Textarea
                  name="faq_answer"
                  defaultValue={post?.faq?.[0]?.answer}
                  placeholder="Answer text..."
                  className="min-h-[100px] bg-white/5 border-white/10 rounded-lg resize-none text-xs leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="rounded-xl border-white/10 bg-card sticky top-24">
            <CardHeader className="p-6 border-b border-white/5">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Checkbox 
                  id="published" 
                  name="published" 
                  defaultChecked={post?.published} 
                />
                <label 
                  htmlFor="published" 
                  className="text-xs font-bold text-white cursor-pointer select-none"
                >
                  Published & Public
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">CVE ID</label>
                <Input
                  name="cveId"
                  defaultValue={post?.cveId}
                  placeholder="CVE-..."
                  className="h-11 bg-white/5 border-white/10 font-mono text-primary text-sm rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Date Disclosed</label>
                <Input
                  name="dateDisclosed"
                  type="date"
                  defaultValue={post?.dateDisclosed ? new Date(post.dateDisclosed).toISOString().split('T')[0] : ""}
                  className="h-10 bg-white/5 border-white/10 rounded-lg text-xs font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-red-500/60 font-bold">Deadline</label>
                <Input
                  name="remediationDeadline"
                  type="date"
                  defaultValue={post?.remediationDeadline ? new Date(post.remediationDeadline).toISOString().split('T')[0] : ""}
                  className="h-10 bg-white/10 border-red-500/20 text-red-500 focus-visible:ring-red-500/40 rounded-lg text-xs font-bold"
                />
              </div>

              <Button type="submit" size="lg" className="w-full h-12 rounded-lg font-bold text-[11px] uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                <Save className="size-4 mr-2" />
                Save Post
              </Button>

              <div className="p-4 rounded-lg bg-white/5 border border-white/5 flex gap-3">
                <Info className="size-4 text-primary shrink-0" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Toggle "Published" to control visibility on the public portal.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
