import { Book } from './quicksort';

// BUSCA BINARIA
// Busca por livros que contêm o termo no título (em qualquer posição)
// Usa busca binária para encontrar um ponto de partida e depois expande linearmente
export function binarySearch(arr: Book[], titleSearch: string): Book[] {
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

