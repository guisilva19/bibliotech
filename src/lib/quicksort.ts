export interface Book {
  id: string;
  title: string;
  coverimg?: string | null;
  rating?: number;
  ratings_count?: number;
}

// QUICKSORT 
export function quickSort(arr: Book[], start: number = 0, end: number = arr.length - 1): Book[] {
  if (start < end) {
    const pivoIndex = partition(arr, start, end);
    quickSort(arr, start, pivoIndex - 1);
    quickSort(arr, pivoIndex + 1, end);
  }
  return arr;
}

function partition(arr: Book[], start: number, end: number): number {
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

