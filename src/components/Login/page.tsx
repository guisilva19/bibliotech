'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { HiMail, HiLockClosed, HiArrowRight } from 'react-icons/hi';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/Loading';

const loginSchema = yup.object({
  email: yup
    .string()
    .email('Email deve ter um formato válido')
    .required('Email é obrigatório'),
  password: yup
    .string()
    .required('Senha é obrigatória'),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

export default function LoginComponent() {
  const router = useRouter();
  const { login } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const loginPromise = fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }
      return response.json();
    });

    toast.promise(loginPromise, {
      loading: 'Entrando...',
      success: (result) => {
        if (result?.access_token) {
          login(result.access_token);
          setIsRedirecting(true);
            router.push('/inicio');
        }
        return '';
      },
      error: (error) => error.message,
    });
  };

  if (isRedirecting) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{
      background: 'linear-gradient(to bottom right, #f7ead9, #e1d2a9, #f7ead9)'
    }}>
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
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-2xl" style={{
        background: 'linear-gradient(to right, rgba(103, 89, 78, 0.1), rgba(136, 180, 153, 0.1))'
      }}></div>

      <motion.div 
        className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden" 
        style={{
          border: '1px solid rgba(225, 210, 169, 0.3)'
        }}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex min-h-[600px]">
          <div className="flex-1 p-12 flex flex-col justify-center relative" style={{
            background: 'linear-gradient(to bottom right, #619885, #88b499, #67594e)'
          }}>
            <div className="absolute top-8 left-8 w-16 h-16 bg-white/20 rounded-full blur-sm"></div>
            <div className="absolute bottom-8 right-8 w-24 h-24 bg-white/15 rounded-full blur-md"></div>
            <div className="absolute top-1/2 right-8 w-12 h-12 bg-white/25 rounded-full blur-sm"></div>
            
            <div className="absolute top-16 right-16 w-8 h-8 border-2 border-white/30 rounded-full"></div>
            <div className="absolute bottom-16 left-16 w-6 h-6 bg-white/20 rounded-sm rotate-45"></div>
            <div className="absolute top-1/3 left-12 w-4 h-4 bg-white/30 rounded-full"></div>
            
            <div className="relative z-10">
              <h1 className="text-3xl font-bold text-white mb-6 leading-tight">
                Olá, seja bem-vindo!
              </h1>
              <p className="text-white/90 text-lg leading-relaxed">
                Faça login para acessar sua biblioteca pessoal e descobrir novos livros incríveis.
              </p>
            </div>
          </div>

          <div className="flex-1 p-12 flex flex-col justify-center">
            <div className="max-w-sm mx-auto w-full">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2" style={{ color: '#67594e' }}>Entrar</h2>
                <p className="text-sm" style={{ color: 'rgba(103, 89, 78, 0.7)' }}>Acesse sua conta Bibliotech</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold" style={{ color: '#67594e' }}>
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <HiMail className="h-5 w-5" style={{ color: '#4a3c2a' }} />
                    </div>
                    <input
                      {...register('email')}
                      type="email"
                      id="email"
                      className={`w-full pl-12 pr-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.email
                          ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                          : 'border-gray-300 focus:ring-orange-300 focus:border-orange-700'
                      }`}
                      style={{
                        backgroundColor: 'rgba(247, 234, 217, 0.9)',
                        borderColor: errors.email ? '#f87171' : 'rgba(225, 210, 169, 0.5)'
                      }}
                      placeholder="seu@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600 font-medium">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold" style={{ color: '#67594e' }}>
                    Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <HiLockClosed className="h-5 w-5" style={{ color: '#4a3c2a' }} />
                    </div>
                    <input
                      {...register('password')}
                      type="password"
                      id="password"
                      className={`w-full pl-12 pr-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.password
                          ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                          : 'border-gray-300 focus:ring-orange-300 focus:border-orange-700'
                      }`}
                      style={{
                        backgroundColor: 'rgba(247, 234, 217, 0.9)',
                        borderColor: errors.password ? '#f87171' : 'rgba(225, 210, 169, 0.5)'
                      }}
                      placeholder="Sua senha"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 font-medium">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-200" />
                    <span className="ml-2 text-sm" style={{ color: '#67594e' }}>Lembrar de mim</span>
                  </label>
                  <a href="#" className="text-sm transition-colors" style={{ color: '#619885' }} onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#88b499'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#619885'}>
                    Esqueceu a senha?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:transform-none relative overflow-hidden group hover:opacity-90"
                  style={{
                    background: '#619885'
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Entrando...
                      </>
                    ) : (
                      <>
                        Entrar
                        <HiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm" style={{ color: 'rgba(103, 89, 78, 0.7)' }}>
                  Novo aqui?{' '}
                  <a href="#" className="font-semibold transition-colors" style={{ color: '#619885' }} onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#88b499'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#619885'}>
                    Criar uma Conta
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}