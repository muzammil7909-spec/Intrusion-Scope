import MotionProvider from "@/components/providers/MotionProvider";

export default function PublicLayout({ children }) {
  return (
    <MotionProvider>
      <div className="flex flex-col min-h-screen selection:bg-primary/20">
        <main className="flex-grow">{children}</main>
      </div>
    </MotionProvider>
  );
}
