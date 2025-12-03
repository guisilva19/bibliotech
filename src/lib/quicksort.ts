export interface Book {
  id: string;
  title: string;
  coverimg?: string | null;
  rating?: number;
  ratings_count?: number;
}

export interface Genre {
  id: string;
  genre: string;
  createdAt: string;
  updatedAt: string;
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// QUICKSORT 
export function quickSortBooks(arr: Book[], start: number = 0, end: number = arr.length - 1): Book[] {
  if (start < end) {
    const pivoIndex = partitionBooks(arr, start, end);
    quickSortBooks(arr, start, pivoIndex - 1);
    quickSortBooks(arr, pivoIndex + 1, end);
  }
  return arr;
}

function partitionBooks(arr: Book[], start: number, end: number): number {
  const pivo = normalizeText(arr[end].title);
  let i = start - 1;

  for (let j = start; j < end; j++) {
    if (normalizeText(arr[j].title) <= pivo) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[end]] = [arr[end], arr[i + 1]];
  return i + 1;
}

// QUICKSORT PARA GENRES
export function quickSortGenres(arr: Genre[], start: number = 0, end: number = arr.length - 1): Genre[] {
  if (start < end) {
    const pivoIndex = partitionGenres(arr, start, end);
    quickSortGenres(arr, start, pivoIndex - 1);
    quickSortGenres(arr, pivoIndex + 1, end);
  }
  return arr;
}

function partitionGenres(arr: Genre[], start: number, end: number): number {
  const pivo = normalizeText(arr[end].genre);
  let i = start - 1;

  for (let j = start; j < end; j++) {
    if (normalizeText(arr[j].genre) <= pivo) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[end]] = [arr[end], arr[i + 1]];
  return i + 1;
}

