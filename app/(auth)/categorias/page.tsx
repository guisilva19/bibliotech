'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import { useStats } from '@/contexts/StatsContext';
import { HiChevronLeft, HiChevronRight, HiSearch, HiPlus } from 'react-icons/hi';
import { quickSortGenres, Genre } from '@/lib/quicksort';
import { binarySearchGenres } from '@/lib/binarySearch';
import { GenreCard, GenreSearch } from '@/components/Categorias';
import ConfirmModal from '@/components/Categorias/ConfirmModal';

function CategoriasContent() {
  const { sidebarOpen } = useSidebar();
  const { refreshStats } = useStats();
  const [allGenres, setAllGenres] = useState<Genre[]>([]);
  const [displayedGenres, setDisplayedGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortTime, setSortTime] = useState<number | null>(null);
  const [searchTime, setSearchTime] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState<Genre | null>(null);
  const [newGenreName, setNewGenreName] = useState('');
  const genresPerPage = 20;

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function carregarCategorias() {
    try {
      setLoading(true);
      const response = await fetch('/api/genre', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar categorias');
      }

      const data = await response.json();

      // ordena com quicksort
      const inicioTempo = performance.now();
      const categoriasOrdenadas = quickSortGenres([...data]);
      const fimTempo = performance.now();
      setSortTime(fimTempo - inicioTempo);

      setAllGenres(categoriasOrdenadas);
      setDisplayedGenres(categoriasOrdenadas.slice(0, genresPerPage));
      setCurrentPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  // calcula categorias filtradas com useMemo para evitar recálculos
  const categoriasFiltradas = useMemo(() => {
    if (!allGenres.length) return [];
    
    let resultado: Genre[] = [];
    
    // Aplica busca binária se houver termo de busca
    if (searchTerm.trim()) {
      const inicioTempo = performance.now();
      resultado = binarySearchGenres(allGenres, searchTerm);
      const fimTempo = performance.now();
      setSearchTime(fimTempo - inicioTempo);
    } else {
      resultado = [...allGenres];
      setSearchTime(null);
    }
    
    return resultado;
  }, [searchTerm, allGenres]);

  // calcula total de páginas
  const totalPaginas = useMemo(() => {
    return Math.ceil(categoriasFiltradas.length / genresPerPage);
  }, [categoriasFiltradas.length, genresPerPage]);

  // reseta para página 1 quando busca muda
  useEffect(() => {
    if (!allGenres.length) return;
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // atualiza quando página muda ou categorias filtradas mudam
  useEffect(() => {
    if (!allGenres.length || !categoriasFiltradas.length) {
      setDisplayedGenres([]);
      return;
    }
    
    const inicioIndex = (currentPage - 1) * genresPerPage;
    const fimIndex = inicioIndex + genresPerPage;
    const categoriasParaMostrar = categoriasFiltradas.slice(inicioIndex, fimIndex);
    setDisplayedGenres(categoriasParaMostrar);
  }, [currentPage, categoriasFiltradas, genresPerPage, allGenres.length]);

  // atualiza quando categorias são carregadas pela primeira vez
  useEffect(() => {
    if (allGenres.length > 0 && displayedGenres.length === 0 && !searchTerm) {
      setCurrentPage(1);
      setDisplayedGenres(allGenres.slice(0, genresPerPage));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allGenres.length]);

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
    const maxPaginas = 7;

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

  async function handleAddGenre() {
    if (!newGenreName.trim()) return;

    try {
      const response = await fetch('/api/genre', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ genre: newGenreName.trim() }),
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar categoria');
      }

      setNewGenreName('');
      setShowAddModal(false);
      await carregarCategorias();
      await refreshStats(); // Atualiza estatísticas
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao adicionar categoria');
    }
  }

  function openDeleteModal(genre: Genre) {
    setGenreToDelete(genre);
    setShowDeleteModal(true);
  }

  async function handleDeleteGenre() {
    if (!genreToDelete) return;

    try {
      const response = await fetch(`/api/genre/${genreToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao remover categoria');
      }

      setShowDeleteModal(false);
      setGenreToDelete(null);
      await carregarCategorias();
      await refreshStats(); // Atualiza estatísticas
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao remover categoria');
    }
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
                  Gerencie suas categorias
                </p>
                <p className="text-base leading-relaxed" style={{ color: 'rgba(103, 89, 78, 0.7)' }}>
                  Adicione ou remova categorias de livros
                </p>
              </div>

              {/* INPUT DE BUSCA E BOTÃO ADICIONAR */}
              {!loading && (
                <div className="flex items-center justify-between gap-3" style={{ zIndex: 100 }}>
                  <div className="max-w-xl relative flex-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <HiSearch className="w-6 h-6" style={{ color: '#67594e' }} />
                      </div>
                      <input
                        type="text"
                        placeholder="Buscar categoria por nome..."
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
                  
                  {/* BOTÃO ADICIONAR */}
                  <button
                    onClick={() => {
                      setNewGenreName('');
                      setShowAddModal(true);
                    }}
                    className="px-6 py-2.5 rounded-lg border transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-100"
                    style={{
                      backgroundColor: '#619885',
                      borderColor: '#619885',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    <HiPlus className="w-5 h-5" />
                    <span>Adicionar Categoria</span>
                  </button>
                </div>
              )}
              
              {/* RESULTADOS DA BUSCA */}
              {!loading && allGenres.length > 0 && searchTerm && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center gap-3"
                >
                  <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm" style={{
                    border: '1px solid rgba(225, 210, 169, 0.4)'
                  }}>
                    <p className="text-sm font-bold" style={{ color: '#67594e' }}>
                      {categoriasFiltradas.length.toLocaleString('pt-BR')} {categoriasFiltradas.length === 1 ? 'categoria encontrada' : 'categorias encontradas'}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-4 border-t-[#619885] rounded-full animate-spin mb-4"></div>
                <p className="text-lg" style={{ color: 'rgba(103, 89, 78, 0.7)' }}>Carregando categorias...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 min-h-[200px]">
                <p className="text-red-600">Erro: {error}</p>
              </div>
            ) : displayedGenres.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {displayedGenres.map((genre) => (
                    <GenreCard 
                      key={genre.id} 
                      genre={genre}
                      onDelete={openDeleteModal}
                    />
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
                      Página {currentPage} de {totalPaginas} - Mostrando {displayedGenres.length} de {categoriasFiltradas.length} categorias
                    </p>
                  </div>
                )}
              </>
            ) : !loading && !error ? (
              <div className="text-center py-12 min-h-[200px]">
                <p className="text-lg" style={{ color: 'rgba(103, 89, 78, 0.7)' }}>
                  Nenhuma categoria encontrada
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      {/* MODAL ADICIONAR */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div 
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'rgba(247, 234, 217, 0.98)',
              border: '1px solid rgba(225, 210, 169, 0.5)'
            }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#67594e' }}>Adicionar Categoria</h2>
            <input
              type="text"
              placeholder="Nome da categoria"
              value={newGenreName}
              onChange={(e) => setNewGenreName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border mb-4 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderColor: 'rgba(225, 210, 169, 0.5)',
                color: '#67594e'
              }}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddGenre();
                } else if (e.key === 'Escape') {
                  setShowAddModal(false);
                }
              }}
            />
            <div className="flex gap-3">
              <button
                onClick={handleAddGenre}
                className="flex-1 px-4 py-2 rounded-lg font-medium text-white transition-all duration-200"
                style={{ backgroundColor: '#619885' }}
              >
                Adicionar
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE REMOÇÃO */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Remover Categoria"
        message={`Tem certeza que deseja remover a categoria "${genreToDelete?.genre}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDeleteGenre}
        onCancel={() => {
          setShowDeleteModal(false);
          setGenreToDelete(null);
        }}
        confirmText="Remover"
        cancelText="Cancelar"
      />

    </div>
  );
}

export default function PageCategorias() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <CategoriasContent />
    </SidebarProvider>
  );
}

