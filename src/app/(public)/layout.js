export default function PublicLayout({ children }) {
  return (
    <>
      {/* Header and Footer for public pages can be added here */}
      <main className="flex-grow">{children}</main>
    </>
  );
}
