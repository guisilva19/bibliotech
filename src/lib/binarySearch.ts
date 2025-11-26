import { Book, Genre } from './quicksort';

// BUSCA BINARIA PARA BOOKS
// Busca por livros que contêm o termo no título (em qualquer posição)
// Usa busca binária para encontrar um ponto de partida e depois expande linearmente
export function binarySearchBooks(arr: Book[], titleSearch: string): Book[] {
  if (!titleSearch.trim()) return arr;

  const titleSearchLower = titleSearch.toLowerCase();
  const resultados: Book[] = [];

  let esquerda = 0;
  let direita = arr.length - 1;
  let primeiroMatch = -1;

  while (esquerda <= direita) {
    const meio = Math.floor((esquerda + direita) / 2);
    const tituloMeio = arr[meio].title.toLowerCase();

    if (tituloMeio.includes(titleSearchLower)) {
      primeiroMatch = meio;
      direita = meio - 1;
    } else {
      if (tituloMeio < titleSearchLower) {
        esquerda = meio + 1;
      } else {
        direita = meio - 1;
      }
    }
  }

  if (primeiroMatch !== -1) {
    for (let i = primeiroMatch; i < arr.length; i++) {
      if (arr[i].title.toLowerCase().includes(titleSearchLower)) {
        resultados.push(arr[i]);
      }
    }

    for (let i = primeiroMatch - 1; i >= 0; i--) {
      if (arr[i].title.toLowerCase().includes(titleSearchLower)) {
        resultados.unshift(arr[i]);
      }
    }
  }

  return resultados;
}

// BUSCA BINÁRIA PARA CATEGORIAS
// Busca por categorias que contêm o termo no gênero (em qualquer posição)
// Usa busca binária para encontrar um ponto de partida e depois expande linearmente
export function binarySearchGenres(arr: Genre[], genreSearch: string): Genre[] {
  if (!genreSearch.trim()) return arr;

  const genreSearchLower = genreSearch.toLowerCase();
  const resultados: Genre[] = [];

  let esquerda = 0;
  let direita = arr.length - 1;
  let primeiroMatch = -1;

  while (esquerda <= direita) {
    const meio = Math.floor((esquerda + direita) / 2);
    const genreMeio = arr[meio].genre.toLowerCase();

    if (genreMeio.includes(genreSearchLower)) {
      primeiroMatch = meio;
      direita = meio - 1;
    } else {
      if (genreMeio < genreSearchLower) {
        esquerda = meio + 1;
      } else {
        direita = meio - 1;
      }
    }
  }

  if (primeiroMatch !== -1) {
    for (let i = primeiroMatch; i < arr.length; i++) {
      if (arr[i].genre.toLowerCase().includes(genreSearchLower)) {
        resultados.push(arr[i]);
      }
    }

    for (let i = primeiroMatch - 1; i >= 0; i--) {
      if (arr[i].genre.toLowerCase().includes(genreSearchLower)) {
        resultados.unshift(arr[i]);
      }
    }
  }

  return resultados;
}

