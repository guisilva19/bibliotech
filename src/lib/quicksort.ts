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
  const pivo = arr[end].title.toLowerCase();
  let i = start - 1;

  for (let j = start; j < end; j++) {
    if (arr[j].title.toLowerCase() <= pivo) {
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
  const pivo = arr[end].genre.toLowerCase();
  let i = start - 1;

  for (let j = start; j < end; j++) {
    if (arr[j].genre.toLowerCase() <= pivo) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[end]] = [arr[end], arr[i + 1]];
  return i + 1;
}

