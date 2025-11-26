'use client';

import { motion } from 'framer-motion';
import { 
  HiHome, 
  HiMenu,
  HiX,
  HiTag,
  HiBookOpen,
  HiCollection
} from 'react-icons/hi';
import { useSidebar } from '@/contexts/SidebarContext';
import { useStats } from '@/contexts/StatsContext';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const { stats, refreshStats } = useStats();

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  const menuItems = [
    { icon: HiBookOpen, label: 'Livros', path: '/livros' },
    { icon: HiTag, label: 'Categorias', path: '/categorias' },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };


  return (
    <motion.aside 
      className="fixed top-0 left-0 z-40 bg-white shadow-xl flex flex-col"
      style={{
        borderRight: '1px solid rgba(225, 210, 169, 0.3)',
        height: '100vh',
      }}
      initial={{ opacity: 0, x: -20, width: sidebarOpen ? 288 : 80 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        width: sidebarOpen ? 288 : 80
      }}
      transition={{ 
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
        width: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
      }}
    >
      {/* CABEÇALHO DA SIDEBAR */}
      <div className="border-b" style={{
        borderColor: 'rgba(225, 210, 169, 0.3)',
        padding: sidebarOpen ? '28px 24px' : '20px 16px',
        transition: 'padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
          <h1 className={`text-2xl font-bold overflow-hidden whitespace-nowrap ${sidebarOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'}`} style={{ 
            color: '#67594e',
            transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            Bibliotech
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95 shrink-0"
            style={{ color: '#67594e' }}
            aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {sidebarOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MENU DA SIDEBAR */}
      <nav className="flex-1 overflow-y-auto py-4" style={{
        paddingLeft: sidebarOpen ? '16px' : '8px',
        paddingRight: sidebarOpen ? '16px' : '8px',
        transition: 'padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* NAVEGAÇÃO PRINCIPAL */}
        <div className={`space-y-1 mb-6 ${!sidebarOpen ? 'flex flex-col items-center' : ''}`}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (item.path === '/livros' && pathname === '/');
            return (
              <motion.button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className="w-full flex items-center group cursor-pointer"
                style={{
                  backgroundColor: isActive ? 'rgba(97, 152, 133, 0.1)' : 'transparent',
                  color: isActive ? '#619885' : '#67594e',
                  padding: sidebarOpen ? '14px 16px' : '14px 0',
                  borderRadius: '12px',
                  gap: sidebarOpen ? '14px' : '0',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(97, 152, 133, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1], delay: index * 0.03 }}
              >
                <Icon className="w-5 h-5 shrink-0 transition-transform duration-200" style={{
                  transform: isActive ? 'scale(1.1)' : 'scale(1)'
                }} />
                <span className={`font-medium text-sm overflow-hidden whitespace-nowrap ${sidebarOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'}`} style={{
                  transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* ESTATÍSTICAS */}
        {sidebarOpen && (
          <motion.div
            className="mb-6 p-4 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(97, 152, 133, 0.1), rgba(97, 152, 133, 0.05))',
              border: '1px solid rgba(97, 152, 133, 0.2)'
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <HiBookOpen className="w-4 h-4" style={{ color: '#619885' }} />
              <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#619885' }}>
                Estatísticas
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'rgba(103, 89, 78, 0.7)' }}>Total de Livros</span>
                <span className="text-sm font-bold" style={{ color: '#67594e' }}>
                  {stats.books.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'rgba(103, 89, 78, 0.7)' }}>Total de Categorias</span>
                <span className="text-sm font-bold" style={{ color: '#67594e' }}>
                  {stats.categories.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </motion.div>
        )}

      </nav>
    </motion.aside>
  );
}

