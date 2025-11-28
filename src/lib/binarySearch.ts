import { Book, Genre } from './quicksort';

// BUSCA BINARIA PARA BOOKS (OTIMIZADA)
// Busca por livros que contêm o termo no título (em qualquer posição)
// Usa busca binária para encontrar um ponto de partida e depois expande otimizadamente
export function binarySearchBooks(arr: Book[], titleSearch: string): Book[] {
  if (!titleSearch.trim()) return arr;

  const titleSearchLower = titleSearch.toLowerCase();
  const resultados: Book[] = [];

  let esquerda = 0;
  let direita = arr.length - 1;
  let primeiroMatch = -1;

  // Busca binária tradicional para encontrar o primeiro título que começa com o termo
  while (esquerda <= direita) {
    const meio = Math.floor((esquerda + direita) / 2);
    const tituloMeio = arr[meio].title.toLowerCase();

    if (tituloMeio.startsWith(titleSearchLower)) {
      primeiroMatch = meio;
      direita = meio - 1; // continua procurando o primeiro match
    } else if (tituloMeio < titleSearchLower) {
      esquerda = meio + 1;
    } else {
      direita = meio - 1;
    }
  }

  if (primeiroMatch === -1) {
    return resultados;
  }

  // Coleta sequencial de todos os títulos adjacentes que compartilham o mesmo prefixo
  for (let i = primeiroMatch; i < arr.length; i++) {
    const tituloAtual = arr[i].title.toLowerCase();
    if (!tituloAtual.startsWith(titleSearchLower)) {
      break;
    }
    resultados.push(arr[i]);
  }

  return resultados;
}

// BUSCA BINÁRIA PARA CATEGORIAS
// Busca por categorias que contêm o termo no gênero (em qualquer posição)
// Usa busca binária para encontrar um ponto de partida e depois expande otimizadamente
export function binarySearchGenres(arr: Genre[], genreSearch: string): Genre[] {
  if (!genreSearch.trim()) return arr;

  const genreSearchLower = genreSearch.toLowerCase();
  const resultados: Genre[] = [];
  const resultadosEsquerda: Genre[] = [];

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
    // Expande para a direita
    for (let i = primeiroMatch; i < arr.length; i++) {
      if (arr[i].genre.toLowerCase().includes(genreSearchLower)) {
        resultados.push(arr[i]);
      }
    }

    // Expande para a esquerda - coleta em array separado
    for (let i = primeiroMatch - 1; i >= 0; i--) {
      if (arr[i].genre.toLowerCase().includes(genreSearchLower)) {
        resultadosEsquerda.push(arr[i]);
      }
    }
    
    // Inverte e concatena (mais rápido que múltiplos unshift())
    resultadosEsquerda.reverse();
    return [...resultadosEsquerda, ...resultados];
  }

  return resultados;
}

