"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Mail, Lock, Loader2, Globe } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result.error) {
        setError("Invalid credentials. Access denied.");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/10 blur-[120px] rounded-full animate-pulse delay-700"></div>
      
      <div className="w-full max-w-md px-6 relative z-10 animate-fade-in">
        <div className="text-center mb-10 space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/50 shadow-xl shadow-primary/20 mb-6">
                <Globe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold font-display tracking-tight text-foreground">IntrusionScope</h1>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Administrative Access Only</p>
        </div>

        <Card className="border-none bg-card/60 backdrop-blur-2xl shadow-2xl shadow-black/50 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="pt-10 px-10 pb-2">
            <CardTitle className="text-2xl font-bold font-display">Identity Verification</CardTitle>
            <CardDescription className="text-muted-foreground">Please enter your authorized credentials to proceed.</CardDescription>
          </CardHeader>
          <CardContent className="p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-xl animate-shake">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Personnel Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 pl-12 bg-white/5 border-white/5 focus-visible:ring-primary focus-visible:border-primary/50 rounded-xl transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Access Token</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 pl-12 bg-white/5 border-white/5 focus-visible:ring-primary focus-visible:border-primary/50 rounded-xl transition-all"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    Authenticate Account
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <p className="text-center mt-10 text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-40">
            System Monitoring Active • Restricted Access
        </p>
      </div>
    </div>
  );
}
