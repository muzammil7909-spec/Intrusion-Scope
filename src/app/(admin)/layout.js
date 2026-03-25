export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Admin Sidebar can be added here */}
      <main className="flex-grow p-8">{children}</main>
    </div>
  );
}
