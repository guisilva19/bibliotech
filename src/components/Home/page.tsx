'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';

function HomeContent() {
  const { sidebarOpen } = useSidebar();

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{
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

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col overflow-hidden" style={{
        marginLeft: sidebarOpen ? '288px' : '80px', // COMPENSA A LARGURA DA SIDEBAR
        transition: 'margin-left 400ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* HEADER */}
        <Header />

        {/* ÁREA DE CONTEÚDO */}
        <div className="flex-1 overflow-y-auto p-8" style={{
          paddingTop: '150px' // ESPAÇO PARA O HEADER FIXO
        }}>
          <div className="max-w-7xl mx-auto">
            {/* SEÇÃO DE BOAS-VINDAS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold mb-3" style={{ color: '#67594e' }}>
                Bem-vindo ao Bibliotech!
              </h2>
              <p className="text-lg" style={{ color: 'rgba(103, 89, 78, 0.7)' }}>
                Gerencie sua biblioteca pessoal, organize seus livros e acompanhe suas leituras
              </p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function HomeComponent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <HomeContent />
    </SidebarProvider>
  );
}
