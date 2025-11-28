import { Book } from './quicksort';

// INSERTION SORT PARA BOOKS (VERSÃO MÁXIMA VELOCIDADE)
// Algoritmo O(n²) - otimizado ao máximo para velocidade
// Processa o máximo possível antes de liberar o event loop
export async function insertionSortBooksAsync(
  arr: Book[],
  onProgress?: (progress: number) => void
): Promise<Book[]> {
  const resultado = [...arr];
  const n = resultado.length;
  // Chunk size extremamente grande - processa centenas de milhares de operações antes de pausar
  const CHUNK_SIZE = 200000; // 200k operações antes de pausar
  let operationsInChunk = 0;
  let lastProgressUpdate = 0;
  const PROGRESS_UPDATE_INTERVAL = 5000; // Atualiza progresso a cada 5000 iterações
  
  // Atualiza progresso inicial
  if (onProgress) {
    onProgress(0);
  }

  for (let i = 1; i < n; i++) {
    const chave = resultado[i];
    const chaveTitleLower = chave.title.toLowerCase();
    let j = i - 1;

    // Move elementos maiores que a chave uma posição à frente
    while (j >= 0 && resultado[j].title.toLowerCase() > chaveTitleLower) {
      resultado[j + 1] = resultado[j];
      j = j - 1;
      operationsInChunk++;
      
      // A cada CHUNK_SIZE operações, libera o event loop (muito raro)
      if (operationsInChunk >= CHUNK_SIZE) {
        operationsInChunk = 0;
        // Pausa mínima - apenas para manter UI responsiva
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // Atualiza progresso apenas se mudou significativamente
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
    
    // Atualiza progresso apenas a cada PROGRESS_UPDATE_INTERVAL iterações (overhead mínimo)
    if (i % PROGRESS_UPDATE_INTERVAL === 0 || i === n - 1) {
      // Não pausa aqui se já pausou recentemente
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

