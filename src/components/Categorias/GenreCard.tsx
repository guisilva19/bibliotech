import { HiTrash, HiTag } from 'react-icons/hi';
import { Genre } from '@/lib/quicksort';

interface GenreCardProps {
  genre: Genre;
  onDelete: (genre: Genre) => void;
}

export default function GenreCard({ genre, onDelete }: GenreCardProps) {
  return (
    <div
      className="bg-white/90 backdrop-blur-xl rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 group relative"
      style={{
        border: '1px solid rgba(225, 210, 169, 0.3)'
      }}
    >
      <div className="p-4 flex items-center justify-between gap-3">
        {/* Ícone e Nome */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div 
            className="p-2 rounded-lg shrink-0 transition-all duration-200"
            style={{
              backgroundColor: 'rgba(97, 152, 133, 0.1)',
              border: '1px solid rgba(97, 152, 133, 0.2)'
            }}
          >
            <HiTag className="w-4 h-4" style={{ color: '#619885' }} />
          </div>
          <h3 
            className="font-medium text-sm leading-tight break-words truncate" 
            style={{ color: '#67594e' }}
            title={genre.genre}
          >
            {genre.genre}
          </h3>
        </div>

        {/* Botão Remover - Pequeno */}
        <button
          onClick={() => onDelete(genre)}
          className="p-1.5 rounded-md transition-all duration-200 hover:scale-110 active:scale-95 shrink-0 opacity-60 hover:opacity-100"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444'
          }}
          title="Remover categoria"
        >
          <HiTrash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

