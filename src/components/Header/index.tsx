'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HiBell, HiChevronDown, HiUser, HiCog, HiLogout } from 'react-icons/hi';
import { useSidebar } from '@/contexts/SidebarContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { sidebarOpen } = useSidebar();
  const { logout } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationsCount] = useState(3); // Exemplo: número de notificações

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push('/');
  };
  
  return (
    <motion.header 
      className="fixed top-0 right-0 bg-white/90 backdrop-blur-xl shadow-lg z-50" 
      style={{
        borderBottom: '1px solid rgba(225, 210, 169, 0.3)',
      }}
      initial={{ opacity: 0, y: -20, left: sidebarOpen ? 288 : 80 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        left: sidebarOpen ? 288 : 80
      }}
      transition={{ 
        duration: 0.4, 
        ease: [0.4, 0, 0.2, 1],
        left: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
      }}
    >
      <div className="px-8 py-4 flex items-center justify-end">
        <div className="flex items-center gap-3">
          {/* Botão de Notificações */}
          <button
            className="relative p-2.5 rounded-xl hover:bg-white/70 transition-all duration-200 hover:scale-105 active:scale-95 group"
            style={{ 
              color: '#67594e',
              backgroundColor: 'rgba(247, 234, 217, 0.5)'
            }}
            aria-label="Notificações"
          >
            <HiBell className="w-5 h-5 transition-transform duration-200 group-hover:rotate-12" />
            {notificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 ring-2 ring-white animate-pulse">
                {notificationsCount > 9 ? '9+' : notificationsCount}
              </span>
            )}
          </button>

          {/* Avatar com Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/70 transition-all duration-200 hover:scale-105 active:scale-95 group"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.5)'
              }}
              aria-label="Menu do usuário"
            >
              <div 
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 group-hover:shadow-lg ring-2 ring-white/50"
                style={{
                  background: 'linear-gradient(to bottom right, #619885, #88b499)'
                }}
              >
                <span className="text-white font-semibold text-sm">U</span>
              </div>
              <HiChevronDown 
                className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
                style={{ color: '#67594e' }}
              />
            </button>

            {/* Menu Dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
                    style={{
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div className="p-2">
                      <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors duration-150 text-left"
                        style={{ color: '#67594e' }}
                      >
                        <HiUser className="w-4 h-4" />
                        <span className="text-sm">Meu Perfil</span>
                      </button>
                      
                      <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors duration-150 text-left"
                        style={{ color: '#67594e' }}
                      >
                        <HiCog className="w-4 h-4" />
                        <span className="text-sm">Configurações</span>
                      </button>
                      
                      <div className="border-t border-gray-200/50 my-1" />
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors duration-150 text-left"
                        style={{ color: '#dc2626' }}
                      >
                        <HiLogout className="w-4 h-4" />
                        <span className="text-sm font-medium">Sair</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

