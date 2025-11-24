import { HiStar, HiOutlineStar, HiBookOpen } from 'react-icons/hi';
import { Book } from '@/lib/quicksort';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  function renderizarEstrelas(rating: number | undefined) {
    // Pega o valor do rating, se não existir ou for inválido, usa 0
    const ratingValue = (typeof rating === 'number' && !isNaN(rating) && rating > 0) ? rating : 0;
    
    // Se o rating for maior que 5, está em escala 0-500 (ex: 387 = 3.87), então divide por 100
    let ratingNormalizado = ratingValue;
    if (ratingNormalizado > 5) {
      ratingNormalizado = ratingNormalizado / 100;
    }
    
    // Garante que o rating está entre 0 e 5
    ratingNormalizado = Math.min(Math.max(ratingNormalizado, 0), 5);
    
    // Calcula quantas estrelas estão completamente preenchidas
    const estrelasCheias = Math.floor(ratingNormalizado);
    // Calcula a parte decimal para a estrela parcial
    const parteDecimal = ratingNormalizado - estrelasCheias;
    
    const estrelas = [];

    // Sempre mostra 5 estrelas
    for (let i = 0; i < 5; i++) {
      if (i < estrelasCheias) {
        // Estrela completamente preenchida
        estrelas.push(
          <HiStar key={i} className="w-4 h-4" style={{ color: '#fbbf24' }} />
        );
      } else if (i === estrelasCheias && parteDecimal > 0) {
        // Estrela parcialmente preenchida
        const porcentagem = parteDecimal * 100;
        estrelas.push(
          <div key={i} className="relative w-4 h-4">
            <HiOutlineStar className="absolute w-4 h-4" style={{ color: 'rgba(251, 191, 36, 0.3)' }} />
            <HiStar 
              className="absolute w-4 h-4" 
              style={{ 
                color: '#fbbf24',
                clipPath: `inset(0 ${100 - porcentagem}% 0 0)`
              }} 
            />
          </div>
        );
      } else {
        // Estrela vazia
        estrelas.push(
          <HiOutlineStar key={i} className="w-4 h-4" style={{ color: 'rgba(251, 191, 36, 0.3)' }} />
        );
      }
    }

    return estrelas;
  }

  return (
    <div
      className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer"
      style={{
        border: '1px solid rgba(225, 210, 169, 0.3)'
      }}
    >
      <div className="relative w-full aspect-2/3 bg-gray-100 overflow-hidden group/image">
        {book.coverimg ? (
          <img
            src={book.coverimg}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-110"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-full h-full flex items-center justify-center ${book.coverimg ? 'hidden' : ''}`} style={{
          background: 'linear-gradient(to bottom right, #e1d2a9, #d1c2a9)'
        }}>
          <HiBookOpen className="w-12 h-12" style={{ color: 'rgba(103, 89, 78, 0.4)' }} />
        </div>
      </div>

      <div className="p-3 flex flex-col justify-between min-h-[100px]">
        <h3 className="font-semibold text-base line-clamp-2" style={{ color: '#67594e' }}>
          {book.title}
        </h3>

        <div className="flex items-center gap-0.5 mt-auto">
          {renderizarEstrelas(book.rating)}
        </div>
      </div>
    </div>
  );
}

