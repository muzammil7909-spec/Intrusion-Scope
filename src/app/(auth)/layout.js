export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground selection:bg-primary/30">
      {children}
    </div>
  );
}
