export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      {/* SIDEBAR */}
      <aside className="w-64 bg-surface shadow-xl p-6 border-r border-primary/20">
        <h1 className="text-2xl font-bold text-primary mb-8">Bibliotech</h1>

        <nav className="space-y-4">
          <a className="block text-text hover:text-primary" href="/dashboard">🏠 Início</a>
          <a className="block text-text hover:text-primary" href="/dashboard/livros">📚 Livros</a>
          {/* <a className="block text-text hover:text-primary" href="/dashboard/usuarios">👤 Usuários</a> */}
          <a className="block text-text hover:text-primary" href="/dashboard/emprestimos">🔄 Empréstimos</a>
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 bg-surface p-10 shadow-inner">
        {children}
      </main>
    </div>
  );
}
