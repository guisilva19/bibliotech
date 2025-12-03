'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiX, HiTrash, HiSave } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

type BookFormMode = 'create' | 'edit';

export interface BookFormData {
  id?: string;
  title: string;
  author: string;
  rating: number | null;
  genres: string[];
  description: string;
}

interface BookModalProps {
  isOpen: boolean;
  mode: BookFormMode;
  bookId?: string | null;
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
}

export default function BookModal({
  isOpen,
  mode,
  bookId,
  onClose,
  onSuccess
}: BookModalProps) {
  function parseRatingFromApi(raw: any): number | null {
    if (typeof raw !== 'number' || Number.isNaN(raw)) return null;

    let value = raw;
    // Quando vem em escala 0-500 (ex: 419 = 4.19)
    if (value > 5) {
      value = value / 100;
    }

    // Garante intervalo 0-5
    if (value < 0) value = 0;
    if (value > 5) value = 5;

    // Apenas 1 casa decimal
    return Math.round(value * 10) / 10;
  }

  function parseGenresFromApi(raw: any): string[] {
    if (!Array.isArray(raw)) return [];

    // Caso vindo como ["['A', 'B', 'C']"]
    if (raw.length === 1 && typeof raw[0] === 'string') {
      const value = raw[0] as string;
      if (value.trim().startsWith('[')) {
        try {
          const json = JSON.parse(value.replace(/'/g, '"'));
          if (Array.isArray(json)) {
            return json
              .map((g) => (typeof g === 'string' ? g.trim() : ''))
              .filter(Boolean);
          }
        } catch {
          // fallback simples: remove colchetes e divide por vírgula
          const cleaned = value.replace(/^\[/, '').replace(/\]$/, '');
          return cleaned
            .split(',')
            .map((g) => g.replace(/['"]/g, '').trim())
            .filter(Boolean);
        }
      }
    }

    // Caso já venha como array de strings normais
    return raw
      .map((g: any) => (typeof g === 'string' ? g.trim() : ''))
      .filter(Boolean);
  }

  const [form, setForm] = useState<BookFormData>({
    title: '',
    author: '',
    rating: null,
    genres: [],
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Carrega categorias (gêneros) disponíveis
  useEffect(() => {
    if (!isOpen) return;

    async function fetchGenres() {
      try {
        const res = await fetch('/api/genre');
        if (!res.ok) return;
        const data = await res.json();
        const names: string[] = Array.isArray(data)
          ? data
              .map((g: any) => g?.genre)
              .filter((g: any) => typeof g === 'string')
          : [];
        setAvailableGenres(names);
      } catch {
        // silencioso para não quebrar o modal
      }
    }

    fetchGenres();
  }, [isOpen]);

  // Carrega dados do livro para edição
  useEffect(() => {
    if (!isOpen) return;

    // Modo adicionar: sempre iniciar com formulário vazio
    if (mode === 'create') {
      setForm({
        title: '',
        author: '',
        rating: null,
        genres: [],
        description: ''
      });
      setError(null);
      return;
    }

    if (mode !== 'edit' || !bookId) return;

    async function fetchBook() {
      try {
        setError(null);
        const res = await fetch(`/api/books/${bookId}`);
        if (!res.ok) {
          throw new Error('Não foi possível carregar os dados do livro.');
        }
        const data = await res.json();

        setForm({
          id: data.id,
          title: data.title ?? '',
          author: data.author ?? '',
          rating: parseRatingFromApi(data.rating),
          genres: parseGenresFromApi(data.genres),
          description: data.description ?? ''
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar livro.');
      }
    }

    fetchBook();
  }, [isOpen, mode, bookId]);

  function handleChange<K extends keyof BookFormData>(field: K, value: BookFormData[K]) {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  }

  function parseArrayField(value: string): string[] {
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!form.title || !form.author || !form.description) {
        throw new Error('Preencha todos os campos obrigatórios.');
      }

      // Garante que rating esteja entre 0 e 5
      let safeRating = form.rating ?? 0;
      if (safeRating < 0) safeRating = 0;
      if (safeRating > 5) safeRating = 5;

      const payload: any = {
        title: form.title,
        author: form.author,
        rating: safeRating,
        genres: form.genres,
        description: form.description
      };

      // Fecha o modal imediatamente após enviar (para criação/atualização)
      onClose();

      const endpoint = mode === 'create' ? '/api/books' : `/api/books/${bookId}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Erro ao salvar o livro.');
      }

      await onSuccess();

      // Reseta formulário em memória para próxima abertura
      setForm({
        title: '',
        author: '',
        rating: null,
        genres: [],
        description: ''
      });
      setError(null);

      // Toast de sucesso
      toast.success(mode === 'create' ? 'Livro adicionado com sucesso.' : 'Livro atualizado com sucesso.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao salvar o livro.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!bookId) return;
    const confirmed = window.confirm('Tem certeza que deseja deletar este livro?');
    if (!confirmed) return;

    // Fecha o modal imediatamente após a confirmação
    onClose();

    setError(null);
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error('Erro ao deletar o livro.');
      }

      await onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao deletar o livro.');
    } finally {
      setIsDeleting(false);
    }
  }

  function resetOnClose() {
    setForm({
      title: '',
      author: '',
      rating: null,
      genres: [],
      description: ''
    });
    setError(null);
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={resetOnClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto py-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl"
              style={{
                border: '1px solid rgba(225, 210, 169, 0.3)'
              }}
            >
              <div
                className="flex items-center justify-between px-6 py-4 border-b"
                style={{
                  backgroundColor: 'rgba(247, 234, 217, 0.7)',
                  borderColor: 'rgba(225, 210, 169, 0.3)'
                }}
              >
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: '#67594e' }}>
                    {mode === 'create' ? 'Adicionar livro' : 'Editar livro'}
                  </h2>
                  <p className="text-xs mt-1" style={{ color: 'rgba(103, 89, 78, 0.7)' }}>
                    Campos obrigatórios: título, autor, idioma e descrição.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetOnClose}
                  className="p-2 rounded-lg hover:bg-white/60 transition-colors"
                  aria-label="Fechar"
                >
                  <HiX className="w-5 h-5" style={{ color: '#67594e' }} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                {error && (
                  <div className="px-3 py-2 rounded-md text-sm" style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium" style={{ color: '#67594e' }}>
                      Título *
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: 'rgba(247, 234, 217, 0.9)',
                        borderColor: 'rgba(225, 210, 169, 0.6)',
                        color: '#67594e'
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium" style={{ color: '#67594e' }}>
                      Autor *
                    </label>
                    <input
                      type="text"
                      value={form.author}
                      onChange={(e) => handleChange('author', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: 'rgba(247, 234, 217, 0.9)',
                        borderColor: 'rgba(225, 210, 169, 0.6)',
                        color: '#67594e'
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium" style={{ color: '#67594e' }}>
                      Avaliação (0 - 5)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      step={0.1}
                      value={form.rating ?? ''}
                      onChange={(e) => {
                        const raw = e.target.value.replace(',', '.');
                        if (raw === '') {
                          handleChange('rating', null);
                          return;
                        }
                        let num = parseFloat(raw);
                        if (Number.isNaN(num)) {
                          handleChange('rating', null);
                          return;
                        }
                        if (num < 0) num = 0;
                        if (num > 5) num = 5;
                        // limita a uma casa decimal
                        const rounded = Math.round(num * 10) / 10;
                        handleChange('rating', rounded);
                      }}
                      className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: 'rgba(247, 234, 217, 0.9)',
                        borderColor: 'rgba(225, 210, 169, 0.6)',
                        color: '#67594e'
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium" style={{ color: '#67594e' }}>
                    Descrição *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: 'rgba(247, 234, 217, 0.9)',
                      borderColor: 'rgba(225, 210, 169, 0.6)',
                      color: '#67594e'
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium" style={{ color: '#67594e' }}>
                    Categorias
                  </label>
                  {availableGenres.length === 0 ? (
                    <p className="text-xs" style={{ color: 'rgba(103, 89, 78, 0.7)' }}>
                      Nenhuma categoria carregada.
                    </p>
                  ) : (
                    <div className="relative">
                      {/* "Select" visual */}
                      <button
                        type="button"
                        onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
                        className="w-full px-3 py-2 rounded-lg border text-sm flex items-center justify-between"
                        style={{
                          backgroundColor: 'rgba(247, 234, 217, 0.9)',
                          borderColor: 'rgba(225, 210, 169, 0.6)',
                          color: '#67594e',
                          cursor: 'pointer'
                        }}
                      >
                        <span className="truncate text-left">
                          {form.genres.length === 0
                            ? 'Selecione categorias'
                            : form.genres.join(', ')}
                        </span>
                        <span className="ml-2 text-xs" style={{ color: 'rgba(103, 89, 78, 0.7)' }}>
                          ▼
                        </span>
                      </button>

                      {/* Dropdown de opções */}
                      {isCategoryDropdownOpen && (
                        <div
                          className="absolute mt-1 w-full overflow-auto rounded-lg border shadow-lg z-50 bg-white"
                          style={{
                            borderColor: 'rgba(225, 210, 169, 0.8)',
                            maxHeight: '220px'
                          }}
                        >
                          {availableGenres.map((genre) => {
                            const selected = form.genres.includes(genre);
                            return (
                              <button
                                key={genre}
                                type="button"
                                onClick={() => {
                                  setForm((prev) => ({
                                    ...prev,
                                    genres: selected
                                      ? prev.genres.filter((g) => g !== genre)
                                      : [...prev.genres, genre]
                                  }));
                                }}
                                className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-amber-50"
                                style={{
                                  color: '#67594e',
                                  backgroundColor: selected ? 'rgba(97, 152, 133, 0.08)' : 'white',
                                  cursor: 'pointer'
                                }}
                              >
                                <span
                                  className="inline-flex w-4 h-4 rounded border shrink-0"
                                  style={{
                                    borderColor: selected
                                      ? '#619885'
                                      : 'rgba(225, 210, 169, 0.8)',
                                    backgroundColor: selected ? '#619885' : 'transparent'
                                  }}
                                />
                                <span>{genre}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'rgba(225, 210, 169, 0.4)' }}>
                  {mode === 'edit' && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting || isSubmitting}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
                      style={{
                        backgroundColor: '#fee2e2',
                        color: '#b91c1c',
                        cursor: isDeleting || isSubmitting ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <HiTrash className="w-4 h-4" />
                      <span>{isDeleting ? 'Deletando...' : 'Deletar livro'}</span>
                    </button>
                  )}

                  <div className="ml-auto flex items-center gap-2">
                    <button
                      type="button"
                      onClick={resetOnClose}
                      disabled={isSubmitting || isDeleting}
                      className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors disabled:opacity-60"
                      style={{
                        borderColor: 'rgba(225, 210, 169, 0.8)',
                        color: '#67594e',
                        cursor: isSubmitting || isDeleting ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isDeleting}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-md transition-transform duration-150 disabled:opacity-60"
                      style={{
                        backgroundColor: '#619885',
                        cursor: isSubmitting || isDeleting ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <HiSave className="w-4 h-4" />
                      <span>{isSubmitting ? 'Salvando...' : mode === 'create' ? 'Adicionar livro' : 'Salvar alterações'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


