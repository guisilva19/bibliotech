interface BookSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  resultsCount?: number;
}

export default function BookSearch({ searchTerm, onSearchChange, resultsCount }: BookSearchProps) {
  return (
    <div className="max-w-md relative" style={{ zIndex: 100 }}>
      <input
        type="text"
        placeholder="Buscar livros..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-4 py-3 rounded-2xl border focus:outline-none focus:ring-2 transition-all duration-300"
        style={{
          backgroundColor: 'rgba(247, 234, 217, 0.9)',
          borderColor: 'rgba(225, 210, 169, 0.5)',
          color: '#67594e',
          position: 'relative',
          zIndex: 100,
          pointerEvents: 'auto'
        }}
        autoComplete="off"
        tabIndex={0}
      />
      {searchTerm && resultsCount !== undefined && (
        <p className="text-sm mt-2" style={{ color: 'rgba(103, 89, 78, 0.7)' }}>
          {resultsCount} {resultsCount === 1 ? 'livro encontrado' : 'livros encontrados'}
        </p>
      )}
    </div>
  );
}

