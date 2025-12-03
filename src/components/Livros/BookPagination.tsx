import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { useMemo } from 'react';

interface BookPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function BookPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}: BookPaginationProps) {
  const displayedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    return { start, end };
  }, [currentPage, itemsPerPage, totalItems]);

  const paginasParaExibir = useMemo(() => {
    const paginas: (number | string)[] = [];
    const maxPaginas = 7;

    if (totalPages <= maxPaginas) {
      for (let i = 1; i <= totalPages; i++) {
        paginas.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          paginas.push(i);
        }
        paginas.push('...');
        paginas.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        paginas.push(1);
        paginas.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          paginas.push(i);
        }
      } else {
        paginas.push(1);
        paginas.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          paginas.push(i);
        }
        paginas.push('...');
        paginas.push(totalPages);
      }
    }

    return paginas;
  }, [currentPage, totalPages]);

  function irParaPagina(pagina: number) {
    if (pagina >= 1 && pagina <= totalPages) {
      onPageChange(pagina);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function proximaPagina() {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function paginaAnterior() {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center gap-4 mt-8 relative" style={{ zIndex: 10 }}>
      <div className="flex items-center gap-2">
        {/* Botão Anterior */}
        <button
          onClick={paginaAnterior}
          disabled={currentPage === 1}
          type="button"
          className="px-4 py-2 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: currentPage === 1 ? '#ffffff' : '#619885',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            pointerEvents: 'auto',
            zIndex: 10
          }}
          tabIndex={0}
        >
          <HiChevronLeft className="w-5 h-5" />
        </button>

        {/* Números das páginas */}
        <div className="flex items-center gap-1">
          {paginasParaExibir.map((pagina, index) => {
            if (pagina === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-sm font-medium"
                  style={{ color: 'rgba(103, 89, 78, 0.7)' }}
                >
                  ...
                </span>
              );
            }

            const numPagina = pagina as number;
            const isActive = numPagina === currentPage;

            return (
              <button
                key={numPagina}
                onClick={() => irParaPagina(numPagina)}
                type="button"
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 ${
                  isActive ? 'text-white' : 'text-[#67594e]'
                }`}
                style={{
                  backgroundColor: isActive ? '#619885' : '#ffffff',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  zIndex: 10
                }}
                tabIndex={0}
              >
                {numPagina}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}

