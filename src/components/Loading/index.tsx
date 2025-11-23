'use client';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{
      background: 'linear-gradient(to bottom right, #f7ead9, #e1d2a9, #f7ead9)'
    }}>
      {/* ELEMENTOS DECORATIVOS DE FUNDO */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(103, 89, 78, 0.1) 2px,
            rgba(103, 89, 78, 0.1) 4px
          )`
        }}></div>
      </div>

      <div className="absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl" style={{
        background: 'linear-gradient(to bottom right, rgba(136, 180, 153, 0.2), transparent)'
      }}></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl" style={{
        background: 'linear-gradient(to top left, rgba(97, 152, 133, 0.15), transparent)'
      }}></div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 rounded-full animate-spin" style={{
            borderColor: 'rgba(97, 152, 133, 0.2)',
            borderTopColor: '#619885',
            borderRightColor: '#88b499'
          }}></div>
        </div>
        <h2 className="mt-8 text-2xl font-bold" style={{ color: '#67594e' }}>
          Carregando...
        </h2>
        <p className="mt-2 text-sm" style={{ color: 'rgba(103, 89, 78, 0.7)' }}>
          Aguarde um momento
        </p>
      </div>
    </div>
  );
}

