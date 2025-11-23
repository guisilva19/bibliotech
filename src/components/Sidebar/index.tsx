'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  HiHome, 
  HiBookOpen, 
  HiUser, 
  HiCog, 
  HiLogout,
  HiMenu,
  HiX,
  HiTag
} from 'react-icons/hi';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';

export default function Sidebar() {
  const { logout } = useAuth();
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const menuItems = [
    { icon: HiHome, label: 'Início', active: true },
    { icon: HiBookOpen, label: 'Livros', active: false },
    { icon: HiTag, label: 'Categorias', active: false },
    { icon: HiUser, label: 'Perfil', active: false },
    { icon: HiCog, label: 'Configurações', active: false },
  ];

  return (
    <motion.aside 
      className="fixed top-0 left-0 z-40 bg-white/90 backdrop-blur-xl shadow-2xl flex flex-col"
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
      <div className="border-b relative overflow-hidden" style={{
        borderColor: 'rgba(225, 210, 169, 0.3)',
        padding: sidebarOpen ? '24px' : '16px',
        transition: 'padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div className="absolute top-2 right-2 w-12 h-12 bg-white/10 rounded-full blur-sm"></div>
        <div className={`flex items-center relative z-10 ${sidebarOpen ? 'justify-between' : 'justify-center'}`} style={{
          transition: 'justify-content 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <h1 className={`text-2xl font-bold overflow-hidden whitespace-nowrap ${sidebarOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'}`} style={{ 
            color: '#67594e',
            transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            Bibliotech
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl hover:bg-white/50 transition-all duration-300 hover:scale-110 shrink-0"
            style={{ color: '#67594e' }}
          >
            {sidebarOpen ? <HiX className="w-6 h-6 transition-transform duration-300" /> : <HiMenu className="w-6 h-6 transition-transform duration-300" />}
          </button>
        </div>
      </div>

      {/* MENU DA SIDEBAR */}
      <nav className="flex-1 overflow-y-auto" style={{
        padding: sidebarOpen ? '16px' : '8px',
        transition: 'padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div className={`space-y-2 ${!sidebarOpen ? 'flex flex-col items-center' : ''}`} style={{
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={index}
                className={`w-full flex items-center ${
                  item.active 
                    ? 'shadow-lg' 
                    : 'hover:bg-white/50'
                }`}
                style={{
                  backgroundColor: item.active 
                    ? 'rgba(97, 152, 133, 0.15)' 
                    : 'transparent',
                  color: item.active ? '#619885' : '#67594e',
                  padding: sidebarOpen ? '14px 16px' : '12px 0',
                  borderRadius: sidebarOpen ? '16px' : '12px',
                  gap: sidebarOpen ? '16px' : '0',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: index * 0.05 }}
              >
                <Icon className="w-6 h-6 shrink-0 transition-transform duration-300" style={{
                  transform: item.active ? 'scale(1.1)' : 'scale(1)'
                }} />
                <span className={`font-semibold overflow-hidden whitespace-nowrap ${sidebarOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'}`} style={{
                  transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* RODAPÉ DA SIDEBAR */}
      <div className="border-t mt-auto" style={{
        borderColor: 'rgba(225, 210, 169, 0.3)',
        padding: sidebarOpen ? '16px' : '8px',
        transition: 'padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <motion.button
          onClick={handleLogout}
          className="w-full flex items-center hover:bg-red-50"
          style={{ 
            color: '#dc2626',
            padding: sidebarOpen ? '14px 16px' : '12px 0',
            borderRadius: sidebarOpen ? '16px' : '12px',
            gap: sidebarOpen ? '16px' : '0',
            justifyContent: sidebarOpen ? 'flex-start' : 'center',
          }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: menuItems.length * 0.05 + 0.1 }}
        >
          <HiLogout className="w-6 h-6 shrink-0" />
          <span className={`font-semibold overflow-hidden whitespace-nowrap ${sidebarOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'}`} style={{
            transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            Sair
          </span>
        </motion.button>
      </div>
    </motion.aside>
  );
}

