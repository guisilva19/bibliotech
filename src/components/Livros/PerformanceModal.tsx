'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiLightningBolt, HiClock, HiSearch } from 'react-icons/hi';
import { binarySearchBooks } from '@/lib/binarySearch';
import { linearSearchBooks } from '@/lib/linearSearch';
import { Book } from '@/lib/quicksort';

interface PerformanceMetrics {
  sortTime: number;
  searchTime: number | null;
  algorithm: 'quicksort-binary' | 'insertionsort-linear';
}

interface PerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMetrics: PerformanceMetrics;
  comparisonMetrics: PerformanceMetrics | null;
  quicksortBooks: Book[];
  insertionSortBooks: Book[];
}

export default function PerformanceModal({
  isOpen,
  onClose,
  currentMetrics,
  comparisonMetrics,
  quicksortBooks,
  insertionSortBooks
}: PerformanceModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [binarySearchTime, setBinarySearchTime] = useState<number | null>(null);
  const [linearSearchTime, setLinearSearchTime] = useState<number | null>(null);
  const [searchResultsCount, setSearchResultsCount] = useState<{ binary: number; linear: number } | null>(null);

  const formatTime = (time: number | null): string => {
    if (time === null) return 'N/A';
    const timeInSeconds = time / 1000; // Converte de ms para segundos
    // Mostra mais casas decimais para tempos muito pequenos
    if (timeInSeconds < 0.001) {
      return `${timeInSeconds.toFixed(6)} s`;
    } else if (timeInSeconds < 0.01) {
      return `${timeInSeconds.toFixed(5)} s`;
    } else {
      return `${timeInSeconds.toFixed(4)} s`;
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setBinarySearchTime(null);
      setLinearSearchTime(null);
      setSearchResultsCount(null);
      return;
    }

    // Executa múltiplas vezes para ter uma média mais estável e precisa
    // 10 execuções é rápido o suficiente e reduz variações
    const NUM_EXECUTIONS = 10;
    
    // Busca Binária - múltiplas execuções
    let totalBinaryTime = 0;
    let resultadosBinary: Book[] = [];
    for (let i = 0; i < NUM_EXECUTIONS; i++) {
      const inicioBinary = performance.now();
      resultadosBinary = binarySearchBooks(quicksortBooks, searchTerm);
      const fimBinary = performance.now();
      totalBinaryTime += (fimBinary - inicioBinary);
    }
    const avgBinaryTime = totalBinaryTime / NUM_EXECUTIONS;
    setBinarySearchTime(avgBinaryTime);

    // Busca Linear - múltiplas execuções
    let totalLinearTime = 0;
    let resultadosLinear: Book[] = [];
    for (let i = 0; i < NUM_EXECUTIONS; i++) {
      const inicioLinear = performance.now();
      resultadosLinear = linearSearchBooks(insertionSortBooks, searchTerm);
      const fimLinear = performance.now();
      totalLinearTime += (fimLinear - inicioLinear);
    }
    const avgLinearTime = totalLinearTime / NUM_EXECUTIONS;
    setLinearSearchTime(avgLinearTime);

    setSearchResultsCount({
      binary: resultadosBinary.length,
      linear: resultadosLinear.length
    });
  };


  const getAlgorithmName = (algorithm: string): string => {
    if (algorithm === 'quicksort-binary') return 'Quicksort + Busca Binária';
    return 'Insertion Sort + Busca Linear';
  };

  const getAlgorithmDescription = (algorithm: string): string => {
    if (algorithm === 'quicksort-binary') {
      return 'Algoritmo otimizado para grandes volumes de dados. Complexidade O(n log n) para ordenação e O(log n) para busca.';
    }
    return 'Algoritmo menos eficiente para grandes volumes. Complexidade O(n²) para ordenação e O(n) para busca. Mais rápido que Bubble/Selection Sort, mas ainda lento.';
  };

  const calculateSpeedup = (fast: number, slow: number): number => {
    if (slow === 0) return 0;
    return slow / fast;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              style={{
                border: '1px solid rgba(225, 210, 169, 0.3)'
              }}
            >
              {/* Header */}
              <div
                className="sticky top-0 flex items-center justify-between p-6 border-b"
                style={{
                  backgroundColor: 'rgba(247, 234, 217, 0.5)',
                  borderColor: 'rgba(225, 210, 169, 0.3)'
                }}
              >
                <div className="flex items-center gap-3">
                  <HiLightningBolt className="w-6 h-6" style={{ color: '#619885' }} />
                  <h2 className="text-2xl font-bold" style={{ color: '#67594e' }}>
                    Métricas de Performance
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                  aria-label="Fechar"
                >
                  <HiX className="w-5 h-5" style={{ color: '#67594e' }} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Comparação de Ordenação */}
                {comparisonMetrics && (
                  <div
                    className="p-5 rounded-xl"
                    style={{
                      backgroundColor: 'rgba(247, 234, 217, 0.3)',
                      border: '1px solid rgba(225, 210, 169, 0.5)'
                    }}
                  >
                    <h3 className="text-lg font-semibold mb-4" style={{ color: '#67594e' }}>
                      Comparação de Ordenação
                    </h3>

                    <div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="p-3 rounded-lg bg-white/50">
                          <p className="text-xs mb-1" style={{ color: 'rgba(103, 89, 78, 0.6)' }}>
                            Quicksort
                          </p>
                          <p className="text-lg font-bold" style={{ color: '#619885' }}>
                            {formatTime(currentMetrics.algorithm === 'quicksort-binary' ? currentMetrics.sortTime : comparisonMetrics.sortTime)}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-white/50">
                          <p className="text-xs mb-1" style={{ color: 'rgba(103, 89, 78, 0.6)' }}>
                            Insertion Sort
                          </p>
                          <p className="text-lg font-bold" style={{ color: '#67594e' }}>
                            {formatTime(currentMetrics.algorithm === 'insertionsort-linear' ? currentMetrics.sortTime : comparisonMetrics.sortTime)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Comparação de Busca */}
                <div
                  className="p-5 rounded-xl"
                  style={{
                    backgroundColor: 'rgba(97, 152, 133, 0.1)',
                    border: '1px solid rgba(225, 210, 169, 0.5)'
                  }}
                >
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#67594e' }}>
                    Comparação de Busca
                  </h3>

                  {/* Input de busca */}
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <HiSearch className="w-5 h-5" style={{ color: '#67594e' }} />
                        </div>
                        <input
                          type="text"
                          placeholder="Digite o nome de um livro para buscar..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSearch();
                            }
                          }}
                          className="w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                          style={{
                            backgroundColor: 'rgba(247, 234, 217, 0.95)',
                            borderColor: 'rgba(225, 210, 169, 0.5)',
                            color: '#67594e',
                            fontSize: '14px'
                          }}
                        />
                      </div>
                      <button
                        onClick={handleSearch}
                        disabled={!searchTerm.trim()}
                        className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: searchTerm.trim() ? '#619885' : '#9ca3af',
                          cursor: searchTerm.trim() ? 'pointer' : 'not-allowed'
                        }}
                      >
                        Comparar
                      </button>
                    </div>
                  </div>

                  {/* Resultados da busca */}
                  {binarySearchTime !== null && linearSearchTime !== null && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-white/50">
                          <p className="text-xs mb-1" style={{ color: 'rgba(103, 89, 78, 0.6)' }}>
                            Busca Binária
                          </p>
                          <p className="text-lg font-bold" style={{ color: '#619885' }}>
                            {formatTime(binarySearchTime)}
                          </p>
                          {/* {searchResultsCount && (
                            <p className="text-xs mt-1" style={{ color: 'rgba(103, 89, 78, 0.6)' }}>
                              {searchResultsCount.binary} resultado(s)
                            </p>
                          )} */}
                        </div>
                        <div className="p-3 rounded-lg bg-white/50">
                          <p className="text-xs mb-1" style={{ color: 'rgba(103, 89, 78, 0.6)' }}>
                            Busca Linear
                          </p>
                          <p className="text-lg font-bold" style={{ color: '#67594e' }}>
                            {formatTime(linearSearchTime)}
                          </p>
                          {/* {searchResultsCount && (
                            <p className="text-xs mt-1" style={{ color: 'rgba(103, 89, 78, 0.6)' }}>
                              {searchResultsCount.linear} resultado(s)
                            </p>
                          )} */}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

