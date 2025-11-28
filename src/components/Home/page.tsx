'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import { HiStar, HiOutlineStar, HiChevronLeft, HiChevronRight, HiSearch, HiLightningBolt, HiChartBar } from 'react-icons/hi';
import { quickSortBooks, Book } from '@/lib/quicksort';
import { binarySearchBooks} from '@/lib/binarySearch';
import { insertionSortBooksAsync } from '@/lib/insertionsort';
import { linearSearchBooks } from '@/lib/linearSearch';
import { BookCard } from '@/components/Livros';
import PerformanceModal from '@/components/Livros/PerformanceModal';

function HomeContent() {
  const { sidebarOpen } = useSidebar();
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [rawBooks, setRawBooks] = useState<Book[]>([]);
  const [displayedBooks, setDisplayedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [algorithm, setAlgorithm] = useState<'quicksort-binary' | 'insertionsort-linear'>('quicksort-binary');
  const [sortTime, setSortTime] = useState<number | null>(null);
  const [searchTime, setSearchTime] = useState<number | null>(null);
  const [comparisonMetrics, setComparisonMetrics] = useState<{
    sortTime: number;
    searchTime: number | null;
    algorithm: 'quicksort-binary' | 'insertionsort-linear';
  } | null>(null);
  const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);
  const [sortProgress, setSortProgress] = useState<number | null>(null);
  const [isSorting, setIsSorting] = useState(false);
  const [insertionSortCache, setInsertionSortCache] = useState<Book[] | null>(null);
  const [insertionSortTime, setInsertionSortTime] = useState<number | null>(null);
  const [quicksortCache, setQuicksortCache] = useState<Book[] | null>(null);
  const booksPerPage = 50;

  // CARREGA LIVROS APENAS UMA VEZ
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
        setRawBooks(data);
        // LIMPA O CACHE QUANDO NOVOS DADOS SÃO CARREGADOS
        setInsertionSortCache(null);
        setInsertionSortTime(null);
        setQuicksortCache(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    if (rawBooks.length === 0) {
      carregarLivros();
    }
  }, [rawBooks.length]);

  // REORDENA QUANDO ALGORITMO MUDA OU LIVROS SÃO CARREGADOS
  useEffect(() => {
    if (rawBooks.length === 0) return;

    async function ordenarLivros() {
      const inicioTempo = performance.now();
      let livrosOrdenados: Book[];

      if (algorithm === 'quicksort-binary') {
        // QUICKSORT 
        livrosOrdenados = quickSortBooks([...rawBooks]);
        const fimTempo = performance.now();
        setSortTime(fimTempo - inicioTempo);
        // SALVA NO CACHE PARA USO NO MODAL
        setQuicksortCache(livrosOrdenados);
        setSortProgress(null);
        setIsSorting(false);
      } else {
        // INSERTION SORT - VERIFICA SE JÁ EXISTE CACHE
        if (insertionSortCache && insertionSortTime !== null) {
          // USA DADOS DO CACHE - NÃO PRECISA ORDENAR NOVAMENTE
          livrosOrdenados = insertionSortCache;
          setSortTime(insertionSortTime);
          setSortProgress(null);
          setIsSorting(false);
        } else {
          // PRIMEIRA VEZ ORDENANDO COM INSERTION SORT - ORDENA E SALVA NO CACHE
          setIsSorting(true);
          setSortProgress(0);
          
          // FORÇA UMA ATUALIZAÇÃO INICIAL
          await new Promise(resolve => setTimeout(resolve, 10));
          
          livrosOrdenados = await insertionSortBooksAsync(
            [...rawBooks],
            (progress) => {
              // ATUALIZA O PROGRESSO
              setSortProgress(progress);
            }
          );
          const fimTempo = performance.now();
          const tempoOrdenacao = fimTempo - inicioTempo;
          
          // SALVA NO CACHE PARA USO FUTURO
          setInsertionSortCache(livrosOrdenados);
          setInsertionSortTime(tempoOrdenacao);
          setSortTime(tempoOrdenacao);
          setSortProgress(null);
          setIsSorting(false);
        }
      }

      setAllBooks(livrosOrdenados);
      setDisplayedBooks(livrosOrdenados.slice(0, booksPerPage));
      setCurrentPage(1);
    }

    ordenarLivros();
  }, [algorithm, rawBooks, insertionSortCache, insertionSortTime]);

  // GARANTE QUE O CACHE DO QUICKSORT SEMPRE ESTEJA ATUALIZADO PARA O MODAL
  useEffect(() => {
    if (rawBooks.length === 0) return;
    if (!quicksortCache) {
      // SE NÃO TEM CACHE DO QUICKSORT, ORDENA E SALVA
      const livrosOrdenados = quickSortBooks([...rawBooks]);
      setQuicksortCache(livrosOrdenados);
    }
  }, [rawBooks, quicksortCache]);

  // CALCULA LIVROS FILTRADOS
  const livrosFiltrados = useMemo(() => {
    if (!allBooks.length) return [];
    
    let resultado: Book[] = [];
    
    // APLICA BUSCA BASEADA NO ALGORITMO SELECIONADO
    if (searchTerm.trim()) {
      const inicioTempo = performance.now();
      resultado = algorithm === 'quicksort-binary'
        ? binarySearchBooks(allBooks, searchTerm)
        : linearSearchBooks(allBooks, searchTerm);
      const fimTempo = performance.now();
      setSearchTime(fimTempo - inicioTempo);
    } else {
      resultado = [...allBooks];
      setSearchTime(null);
    }
    
    return resultado;
  }, [searchTerm, allBooks, algorithm]);

  // FUNÇÃO PARA COMPARAR PERFORMANCE COM O OUTRO ALGORITMO
  const handleComparePerformance = async () => {
    if (rawBooks.length === 0) return;

    const otherAlgorithm: 'quicksort-binary' | 'insertionsort-linear' = 
      algorithm === 'quicksort-binary' ? 'insertionsort-linear' : 'quicksort-binary';

    // ORDENA COM O OUTRO ALGORITMO E MEDE O TEMPO
    const inicioSort = performance.now();
    let livrosOrdenados: Book[];
    
    if (otherAlgorithm === 'quicksort-binary') {
      livrosOrdenados = quickSortBooks([...rawBooks]);
    } else {
      // MOSTRA PROGRESSO DURANTE A COMPARAÇÃO
      setIsSorting(true);
      setSortProgress(0);
      livrosOrdenados = await insertionSortBooksAsync(
        [...rawBooks],
        (progress) => {
          setSortProgress(progress);
        }
      );
      setIsSorting(false);
      setSortProgress(null);
    }
    
    const fimSort = performance.now();
    const sortTimeOther = fimSort - inicioSort;

    // BUSCA COM O OUTRO ALGORITMO E MEDE O TEMPO
    const inicioSearch = performance.now();
    if (otherAlgorithm === 'quicksort-binary') {
      binarySearchBooks(livrosOrdenados, searchTerm || 'a');
    } else {
      linearSearchBooks(livrosOrdenados, searchTerm || 'a');
    }
    const fimSearch = performance.now();
    const searchTimeOther = fimSearch - inicioSearch;

    setComparisonMetrics({
      sortTime: sortTimeOther,
      searchTime: searchTimeOther,
      algorithm: otherAlgorithm
    });

    setIsPerformanceModalOpen(true);
  };

  // CALCULA TOTAL DE PÁGINAS
  const totalPaginas = useMemo(() => {
    return Math.ceil(livrosFiltrados.length / booksPerPage);
  }, [livrosFiltrados.length, booksPerPage]);

  // RESETA PARA PÁGINA 1 QUANDO A BUSCA MUDA
  useEffect(() => {
    if (!allBooks.length) return;
    setCurrentPage(1);
  }, [searchTerm]);

  // ATUALIZA QUANDO PÁGINA MUDA OU LIVROS FILTRADOS MUDA
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

  // ATUALIZA QUANDO LIVROS SÃO CARREGADOS PELA PRIMEIRA VEZ
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

  // GERA NÚMEROS DAS PÁGINAS PARA EXIBIR
  const paginasParaExibir = useMemo(() => {
    const paginas: (number | string)[] = [];
    const maxPaginas = 7; // MÁXIMO DE NÚMEROS DE PÁGINA A EXIBIR

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
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-xl font-medium mb-1.5 leading-relaxed" style={{ color: '#67594e' }}>
                      Descubra milhares de livros incríveis
                    </p>
                    <p className="text-base leading-relaxed" style={{ color: 'rgba(103, 89, 78, 0.7)' }}>
                      Explore, encontre e mergulhe em novas histórias
                    </p>
                  </div>
                  {sortTime !== null && !loading && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm" style={{
                      border: '1px solid rgba(225, 210, 169, 0.4)'
                    }}>
                      <HiLightningBolt className="w-4 h-4" style={{ color: '#619885' }} />
                      <div>
                        <p className="text-xs" style={{ color: 'rgba(103, 89, 78, 0.6)' }}>
                          Ordenação
                        </p>
                        <p className="text-sm font-bold" style={{ color: '#619885' }}>
                          {(sortTime / 1000).toFixed(3)} s
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* INPUT DE BUSCA E FILTRO */}
              {!loading && allBooks.length > 0 && (
                <div className="space-y-4" style={{ zIndex: 100 }}>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="max-w-xl relative flex-1 min-w-[200px]">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <HiSearch className="w-6 h-6" style={{ color: '#67594e' }} />
                        </div>
                        <input
                          type="text"
                          placeholder="Busque por título, autor ou assunto..."
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
                    
                  </div>

                  {/* SELETOR DE ALGORITMO E MÉTRICAS */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium" style={{ color: '#67594e' }}>
                        Algoritmo:
                      </label>
                      <select
                        value={algorithm}
                        onChange={(e) => setAlgorithm(e.target.value as 'quicksort-binary' | 'insertionsort-linear')}
                        disabled={isSorting}
                        className="px-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: 'rgba(247, 234, 217, 0.95)',
                          borderColor: 'rgba(225, 210, 169, 0.5)',
                          color: '#67594e',
                          fontSize: '13px',
                          fontWeight: '500',
                          cursor: isSorting ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <option value="quicksort-binary">Quicksort + Busca Binária ⚡</option>
                        <option value="insertionsort-linear">Insertion Sort + Busca Linear</option>
                      </select>
                    </div>


                    {/* Indicador de progresso da ordenação */}
                    {isSorting && sortProgress !== null && (
                      <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm" style={{
                        border: '1px solid rgba(225, 210, 169, 0.4)',
                        minWidth: '250px'
                      }}>
                        <div className="w-4 h-4 border-2 border-[#619885] border-t-transparent rounded-full animate-spin"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium" style={{ color: '#67594e' }}>
                              Ordenando com Insertion Sort...
                            </span>
                            <span className="text-xs font-bold" style={{ color: '#619885' }}>
                              {sortProgress.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full overflow-hidden" style={{
                            backgroundColor: 'rgba(225, 210, 169, 0.2)'
                          }}>
                            <div 
                              className="h-full transition-all duration-300 rounded-full"
                              style={{
                                width: `${sortProgress}%`,
                                backgroundColor: '#619885'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Indicador de velocidade da busca */}
                    {searchTime !== null && searchTerm && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 backdrop-blur-sm" style={{
                        border: '1px solid rgba(225, 210, 169, 0.4)'
                      }}>
                        <HiLightningBolt className="w-4 h-4" style={{ 
                          color: algorithm === 'quicksort-binary' ? '#619885' : 'rgba(103, 89, 78, 0.6)'
                        }} />
                        <span className="text-xs font-medium" style={{ color: '#67594e' }}>
                          Busca: {(searchTime / 1000).toFixed(3)} s
                        </span>
                      </div>
                    )}

                    {/* Botão de métricas */}
                    <button
                      onClick={handleComparePerformance}
                      disabled={isSorting}
                      className="px-4 py-2.5 rounded-lg border transition-all duration-200 flex items-center gap-2 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: 'rgba(97, 152, 133, 0.1)',
                        borderColor: '#619885',
                        color: '#619885',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: isSorting ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <HiChartBar className="w-4 h-4" />
                      <span>Comparar Performance</span>
                    </button>
                  </div>
                </div>
              )}
              
              {/* RESULTADOS DA BUSCA */}
              {!loading && allBooks.length > 0 && searchTerm && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center gap-3 flex-wrap"
                >
                  <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm" style={{
                    border: '1px solid rgba(225, 210, 169, 0.4)'
                  }}>
                    <p className="text-sm font-bold" style={{ color: '#67594e' }}>
                      {livrosFiltrados.length.toLocaleString('pt-BR')} {livrosFiltrados.length === 1 ? 'livro encontrado' : 'livros encontrados'}
                    </p>
                  </div>
                  {searchTime !== null && (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm" style={{
                      border: `2px solid ${algorithm === 'quicksort-binary' ? '#619885' : 'rgba(103, 89, 78, 0.4)'}`
                    }}>
                      <HiLightningBolt className="w-5 h-5" style={{ 
                        color: algorithm === 'quicksort-binary' ? '#619885' : 'rgba(103, 89, 78, 0.6)'
                      }} />
                      <div>
                        <p className="text-xs" style={{ color: 'rgba(103, 89, 78, 0.6)' }}>
                          Velocidade da Busca
                        </p>
                        <p className="text-sm font-bold" style={{ 
                          color: algorithm === 'quicksort-binary' ? '#619885' : '#67594e'
                        }}>
                          {(searchTime / 1000).toFixed(3)} segundos
                        </p>
                      </div>
                    </div>
                  )}
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

      {/* Modal de Performance */}
      <PerformanceModal
        isOpen={isPerformanceModalOpen}
        onClose={() => setIsPerformanceModalOpen(false)}
        currentMetrics={{
          sortTime: sortTime || 0,
          searchTime: searchTime || 0,
          algorithm: algorithm
        }}
        comparisonMetrics={comparisonMetrics}
        quicksortBooks={quicksortCache || allBooks}
        insertionSortBooks={insertionSortCache || allBooks}
      />
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
