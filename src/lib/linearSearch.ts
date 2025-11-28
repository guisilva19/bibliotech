import { Book } from './quicksort';

// BUSCA LINEAR PARA BOOKS
// Busca por livros que contêm o termo no título (em qualquer posição)
export function linearSearchBooks(arr: Book[], titleSearch: string): Book[] {
  if (!titleSearch.trim()) return arr;

  const titleSearchLower = titleSearch.toLowerCase();
  const resultados: Book[] = [];

  // Percorre todo o array linearmente
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].title.toLowerCase().startsWith(titleSearchLower)) {
      resultados.push(arr[i]);
    }
  }

  return resultados;
}

