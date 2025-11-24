'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import { HiStar, HiOutlineStar, HiChevronLeft, HiChevronRight, HiSearch } from 'react-icons/hi';
import { quickSort, Book } from '@/lib/quicksort';
import { binarySearch } from '@/lib/binarySearch';
import { BookCard } from '@/components/Livros';

function HomeContent() {
  const { sidebarOpen } = useSidebar();
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [displayedBooks, setDisplayedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'all' | 'top' | 'worst'>('all');
  const [sortTime, setSortTime] = useState<number | null>(null);
  const [searchTime, setSearchTime] = useState<number | null>(null);
  const booksPerPage = 50;

  useEffect(() => {
    async function carregarLivros() {
      try {
        setLoading(true);
        const response = await fetch('/api/books', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao carregar livros');
        }

        const data = await response.json();

        // ordena com quicksort
        const inicioTempo = performance.now();
        const livrosOrdenados = quickSort([...data]);
        const fimTempo = performance.now();
        setSortTime(fimTempo - inicioTempo);


        setAllBooks(livrosOrdenados);
        setDisplayedBooks(livrosOrdenados.slice(0, booksPerPage));
        setCurrentPage(1);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    carregarLivros();
  }, []);

  // Função para normalizar rating (converte de 0-500 para 0-5)
  const normalizarRating = (rating: number | undefined): number => {
    if (rating === undefined || rating === null) return 0;
    const numRating = Number(rating);
    if (isNaN(numRating) || numRating === 0) return 0;
    
    // Se o rating for maior que 5, está em escala 0-500, então divide por 100
    if (numRating > 5) {
      return Math.min(Math.max(numRating / 100, 0), 5);
    }
    return Math.min(Math.max(numRating, 0), 5);
  };

  // calcula livros filtrados com useMemo para evitar recálculos
  const livrosFiltrados = useMemo(() => {
    if (!allBooks.length) return [];
    
    let resultado: Book[] = [];
    
    // Aplica busca binária se houver termo de busca
    if (searchTerm.trim()) {
      const inicioTempo = performance.now();
      resultado = binarySearch(allBooks, searchTerm);
      const fimTempo = performance.now();
      setSearchTime(fimTempo - inicioTempo);
    } else {
      resultado = [...allBooks];
      setSearchTime(null);
    }
    
    // Aplica ordenação por avaliações
    if (ratingFilter === 'top') {
      // Melhores primeiros: ordena do maior para o menor rating
      const sorted = [...resultado].sort((a, b) => {
        const ratingA = normalizarRating(a.rating);
        const ratingB = normalizarRating(b.rating);
        const diff = ratingB - ratingA;
        return diff !== 0 ? diff : 0;
      });
      resultado = sorted;
    } else if (ratingFilter === 'worst') {
      // Piores primeiros: ordena do menor para o maior rating
      const sorted = [...resultado].sort((a, b) => {
        const ratingA = normalizarRating(a.rating);
        const ratingB = normalizarRating(b.rating);
        const diff = ratingA - ratingB;
        return diff !== 0 ? diff : 0;
      });
      resultado = sorted;
    }
    // Se ratingFilter === 'all', mantém a ordem original (já ordenada por título com quicksort)
    
    return resultado;
  }, [searchTerm, allBooks, ratingFilter]);

  // calcula total de páginas
  const totalPaginas = useMemo(() => {
    return Math.ceil(livrosFiltrados.length / booksPerPage);
  }, [livrosFiltrados.length, booksPerPage]);

  // reseta para página 1 quando busca ou filtro muda
  useEffect(() => {
    if (!allBooks.length) return;
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, ratingFilter]);

  // atualiza quando página muda ou livros filtrados mudam
  useEffect(() => {
    if (!allBooks.length || !livrosFiltrados.length) {
      setDisplayedBooks([]);
      return;
    }
    
    const inicioIndex = (currentPage - 1) * booksPerPage;
    const fimIndex = inicioIndex + booksPerPage;
    const livrosParaMostrar = livrosFiltrados.slice(inicioIndex, fimIndex);
    setDisplayedBooks(livrosParaMostrar);
  }, [currentPage, livrosFiltrados, booksPerPage, allBooks.length]);

  // atualiza quando livros são carregados pela primeira vez
  useEffect(() => {
    if (allBooks.length > 0 && displayedBooks.length === 0 && !searchTerm) {
      setCurrentPage(1);
      setDisplayedBooks(allBooks.slice(0, booksPerPage));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allBooks.length]);

  function irParaPagina(pagina: number) {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setCurrentPage(pagina);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function proximaPagina() {
    if (currentPage < totalPaginas) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function paginaAnterior() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // gera números das páginas para exibir
  const paginasParaExibir = useMemo(() => {
    const paginas: (number | string)[] = [];
    const maxPaginas = 7; // máximo de números de página a exibir

    if (totalPaginas <= maxPaginas) {
      for (let i = 1; i <= totalPaginas; i++) {
        paginas.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          paginas.push(i);
        }
        paginas.push('...');
        paginas.push(totalPaginas);
      } else if (currentPage >= totalPaginas - 3) {
        paginas.push(1);
        paginas.push('...');
        for (let i = totalPaginas - 4; i <= totalPaginas; i++) {
          paginas.push(i);
        }
      } else {
        paginas.push(1);
        paginas.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          paginas.push(i);
        }
        paginas.push('...');
        paginas.push(totalPaginas);
      }
    }

    return paginas;
  }, [currentPage, totalPaginas]);

  function renderizarEstrelas(rating: number = 0) {
    const estrelasCheias = Math.floor(rating);
    const temMeiaEstrela = rating % 1 >= 0.5;
    const estrelas = [];

    for (let i = 0; i < 5; i++) {
      if (i < estrelasCheias) {
        estrelas.push(
          <HiStar key={i} className="w-4 h-4" style={{ color: '#fbbf24' }} />
        );
      } else if (i === estrelasCheias && temMeiaEstrela) {
        estrelas.push(
          <div key={i} className="relative w-4 h-4">
            <HiOutlineStar className="absolute w-4 h-4" style={{ color: '#d1d5db' }} />
            <HiStar className="absolute w-4 h-4 overflow-hidden" style={{ color: '#fbbf24', clipPath: 'inset(0 50% 0 0)' }} />
          </div>
        );
      } else {
        estrelas.push(
          <HiOutlineStar key={i} className="w-4 h-4" style={{ color: '#d1d5db' }} />
        );
      }
    }

    return estrelas;
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{
      background: 'linear-gradient(to bottom right, #f7ead9, #e1d2a9, #f7ead9)'
    }}>
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(103, 89, 78, 0.1) 2px,
            rgba(103, 89, 78, 0.1) 4px
          )`
        }}></div>
      </div>

      <div className="absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{
        background: 'linear-gradient(to bottom right, rgba(136, 180, 153, 0.2), transparent)'
      }}></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{
        background: 'linear-gradient(to top left, rgba(97, 152, 133, 0.15), transparent)'
      }}></div>

      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden" style={{
        marginLeft: sidebarOpen ? '288px' : '80px',
        transition: 'margin-left 400ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <Header />

        <div className="flex-1 overflow-y-auto p-8 relative" style={{
          paddingTop: '150px',
          zIndex: 1
        }}>
          <div className="max-w-7xl mx-auto relative" style={{ zIndex: 1 }}>
            {/* SEÇÃO DE HEADER E BUSCA */}
            <div className="mb-10 relative" style={{ zIndex: 10 }}>
              {/* DESCRIÇÃO */}
              <div className="mb-6">
                <p className="text-xl font-medium mb-1.5 leading-relaxed" style={{ color: '#67594e' }}>
                  Descubra milhares de livros incríveis
                </p>
                <p className="text-base leading-relaxed" style={{ color: 'rgba(103, 89, 78, 0.7)' }}>
                  Explore, encontre e mergulhe em novas histórias
                </p>
              </div>

              {/* INPUT DE BUSCA E FILTRO */}
              {!loading && allBooks.length > 0 && (
                <div className="flex items-center gap-3" style={{ zIndex: 100 }}>
                  <div className="max-w-xl relative flex-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <HiSearch className="w-6 h-6" style={{ }} />
                      </div>
                      <input
                        type="text"
                        placeholder="Busque por título, autor ou assunto...)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#619885';
                          e.target.style.boxShadow = '0 0 0 4px rgba(97, 152, 133, 0.15)';
                          e.target.style.transform = 'scale(1.01)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(225, 210, 169, 0.5)';
                          e.target.style.boxShadow = 'none';
                          e.target.style.transform = 'scale(1)';
                        }}
                        className="w-full pl-12 pr-10 py-2.5 rounded-xl border focus:outline-none transition-all duration-300"
                        style={{
                          backgroundColor: 'rgba(247, 234, 217, 0.95)',
                          borderColor: 'rgba(225, 210, 169, 0.5)',
                          color: '#67594e',
                          fontSize: '14px',
                          position: 'relative',
                          zIndex: 100,
                          pointerEvents: 'auto',
                          fontWeight: '500'
                        }}
                        autoComplete="off"
                        tabIndex={0}
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute inset-y-0 right-0 pr-5 flex items-center hover:opacity-70 transition-opacity"
                          style={{ zIndex: 101 }}
                          aria-label="Limpar busca"
                        >
                          <span className="text-2xl font-light leading-none" style={{ color: 'rgba(103, 89, 78, 0.5)' }}>×</span>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* FILTRO DE AVALIAÇÕES */}
                  <button
                    onClick={() => setRatingFilter(ratingFilter === 'top' ? 'all' : 'top')}
                    className={`px-4 py-2.5 rounded-lg border transition-all duration-200 flex items-center gap-2 ${
                      ratingFilter === 'top' ? 'shadow-sm' : ''
                    }`}
                    style={{
                      backgroundColor: ratingFilter === 'top' ? 'rgba(97, 152, 133, 0.15)' : 'rgba(247, 234, 217, 0.95)',
                      borderColor: ratingFilter === 'top' ? '#619885' : 'rgba(225, 210, 169, 0.5)',
                      color: ratingFilter === 'top' ? '#619885' : '#67594e',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}
                  >
                    <HiStar className="w-4 h-4" style={{ color: '#fbbf24' }} />
                    <span>Melhores Avaliações</span>
                  </button>
                </div>
              )}
              
              {/* RESULTADOS DA BUSCA */}
              {!loading && allBooks.length > 0 && searchTerm && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center gap-3"
                >
                  <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm" style={{
                    border: '1px solid rgba(225, 210, 169, 0.4)'
                  }}>
                    <p className="text-sm font-bold" style={{ color: '#67594e' }}>
                      {livrosFiltrados.length.toLocaleString('pt-BR')} {livrosFiltrados.length === 1 ? 'livro encontrado' : 'livros encontrados'}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-4 border-t-[#619885] rounded-full animate-spin mb-4"></div>
                <p className="text-lg" style={{ color: 'rgba(103, 89, 78, 0.7)' }}>Carregando livros...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 min-h-[200px]">
                <p className="text-red-600">Erro: {error}</p>
              </div>
            ) : displayedBooks.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {displayedBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>

                {totalPaginas > 1 && (
                  <div className="flex flex-col items-center gap-4 mt-8 relative" style={{ zIndex: 10 }}>
                    <div className="flex items-center gap-2">
                      {/* Botão Anterior */}
                      <button
                        onClick={paginaAnterior}
                        disabled={currentPage === 1}
                        type="button"
                        className="px-4 py-2 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        style={{
                          background: currentPage === 1 ? '#9ca3af' : '#619885',
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

                      {/* Botão Próximo */}
                      <button
                        onClick={proximaPagina}
                        disabled={currentPage === totalPaginas}
                        type="button"
                        className="px-4 py-2 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        style={{
                          background: currentPage === totalPaginas ? '#9ca3af' : '#619885',
                          cursor: currentPage === totalPaginas ? 'not-allowed' : 'pointer',
                          pointerEvents: 'auto',
                          zIndex: 10
                        }}
                        tabIndex={0}
                      >
                        <HiChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Informação da página */}
                    <p className="text-sm" style={{ color: 'rgba(103, 89, 78, 0.7)' }}>
                      Página {currentPage} de {totalPaginas} - Mostrando {displayedBooks.length} de {livrosFiltrados.length} livros
                    </p>
                  </div>
                )}
              </>
            ) : !loading && !error ? (
              <div className="text-center py-12 min-h-[200px]">
                <p className="text-lg" style={{ color: 'rgba(103, 89, 78, 0.7)' }}>
                  Nenhum livro encontrado
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function HomeComponent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <HomeContent />
    </SidebarProvider>
  );
}
