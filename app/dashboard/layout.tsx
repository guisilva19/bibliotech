export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      {/* SIDEBAR */}
      <main className="flex-1 bg-surface p-10 shadow-inner">
        {children}
      </main>
    </div>
  );
}
