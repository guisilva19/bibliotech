import { Book } from './quicksort';

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// INSERTION SORT PARA BOOKS
export async function insertionSortBooksAsync(
  arr: Book[],
  onProgress?: (progress: number) => void
): Promise<Book[]> {
  const resultado = [...arr];
  const n = resultado.length;
  const CHUNK_SIZE = 200000; // USADO PARA NAO TRAVAR O SITE
  let operationsInChunk = 0;
  let lastProgressUpdate = 0;
  const PROGRESS_UPDATE_INTERVAL = 5000; // Atualiza progresso a cada 5000 iterações
  
  // ATUALIZA PROGRESSO INICIAL
  if (onProgress) {
    onProgress(0);
  }

  for (let i = 1; i < n; i++) {
    const chave = resultado[i];
    const chaveTitleNormalized = normalizeText(chave.title);
    let j = i - 1;

    while (j >= 0 && normalizeText(resultado[j].title) > chaveTitleNormalized) {
      resultado[j + 1] = resultado[j];
      j = j - 1;
      operationsInChunk++;
      
      if (operationsInChunk >= CHUNK_SIZE) {
        operationsInChunk = 0;
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const currentProgress = Math.floor((i / n) * 100);
        if (currentProgress > lastProgressUpdate + 2) {
          lastProgressUpdate = currentProgress;
          if (onProgress) {
            onProgress(Math.min(currentProgress, 99));
          }
        }
      }
    }
    resultado[j + 1] = chave;
    
    if (i % PROGRESS_UPDATE_INTERVAL === 0 || i === n - 1) {
      if (operationsInChunk < CHUNK_SIZE * 0.8) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      const currentProgress = Math.floor((i / n) * 100);
      if (currentProgress > lastProgressUpdate) {
        lastProgressUpdate = currentProgress;
        if (onProgress) {
          onProgress(Math.min(currentProgress, 99));
        }
      }
    }
  }

  if (onProgress) {
    onProgress(100);
  }

  return resultado;
}

