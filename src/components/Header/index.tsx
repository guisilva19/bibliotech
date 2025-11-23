'use client';

import { motion } from 'framer-motion';
import { HiBell } from 'react-icons/hi';
import { useSidebar } from '@/contexts/SidebarContext';

export default function Header() {
  const { sidebarOpen } = useSidebar();
  
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
      <div className="px-8 py-6 flex items-center justify-end">
        <div className="flex items-center gap-4">
          <button
            className="p-3 rounded-xl hover:bg-white/50 transition-all duration-300 relative hover:scale-110 group"
            style={{ color: '#67594e' }}
          >
            <HiBell className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
          </button>
          <div 
            className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg ring-2 ring-white/50"
            style={{
              background: 'linear-gradient(to bottom right, #619885, #88b499)'
            }}
          >
            <span className="text-white font-semibold text-sm">U</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

