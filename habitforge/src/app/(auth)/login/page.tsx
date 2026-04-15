'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Flame, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OAuthButtons } from '@/components/auth/oauth-buttons';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required')
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.message || 'Login failed');
      
      // Store access token
      localStorage.setItem('accessToken', payload.accessToken);
      
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex min-h-screen">
      {/* Left side: Form */}
      <div className="w-full lg:w-[45%] p-8 md:p-16 xl:p-24 flex flex-col justify-center bg-[#0A0A0A]">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="flex items-center gap-2 text-2xl font-display tracking-wide mb-12">
            <Flame className="w-8 h-8 text-[#FF6B00]" />
            <span>HABITFORGE</span>
          </div>

          <h1 className="font-heading text-4xl font-bold mb-2">Welcome back, Forger</h1>
          <p className="text-gray-400 mb-8 font-body">Your next high streak awaits. Sign in to continue.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Email format</label>
              <Input 
                type="email" 
                placeholder="you@email.com" 
                {...register('email')}
                className={`bg-[#141414] border-[#2A2A2A] h-12 focus:border-[#FF6B00] ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-300">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#FF6B00] hover:text-[#FFD700] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input 
                type="password" 
                placeholder="••••••••" 
                {...register('password')}
                className={`bg-[#141414] border-[#2A2A2A] h-12 focus:border-[#FF6B00] ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#FF6B00] hover:bg-[#FFD700] hover:text-black text-white h-12 font-bold text-lg mt-4 transition-all"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Log In'}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2A2A2A]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0A0A0A] px-4 text-gray-500">Or continue with</span>
            </div>
          </div>

          <OAuthButtons />

          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#FF6B00] hover:text-[#FFD700] font-bold">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side: Visuals (Hidden on Mobile) */}
      <div className="hidden lg:flex w-[55%] relative flex-col justify-center items-center overflow-hidden bg-[#141414] border-l border-[#2A2A2A]">
        {/* Abstract Glow Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,_rgba(255,215,0,0.15)_0%,_transparent_70%)] blur-[40px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,_rgba(255,107,0,0.15)_0%,_transparent_70%)] blur-[60px]" />
        </div>

        <div className="z-10 w-full max-w-lg">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-8xl font-display text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 text-center mb-16 leading-none"
          >
            KEEP THE <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FF6B00]">STREAK</span> <br/>
            ALIVE
          </motion.h2>

          {/* Dummy Leaderboard Snapshot */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-[#0A0A0A]/80 backdrop-blur-md rounded-2xl border border-[#2A2A2A] p-6 shadow-2xl relative"
          >
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#FF6B00] rounded-full flex items-center justify-center animate-bounce shadow-[0_0_20px_rgba(255,107,0,0.5)]">
               <Flame className="text-white w-6 h-6" />
            </div>

            <h3 className="font-heading font-bold text-gray-400 text-sm mb-4 tracking-wider uppercase">Global Forgers</h3>
            
            <div className="space-y-3">
              {[
                { name: 'Arjun Sharma', xp: '48,200 XP', emoji: '🦁', color: 'from-[#FFD700] to-[#FF6B00]' },
                { name: 'Priya Nair', xp: '39,100 XP', emoji: '🦊', color: 'from-gray-300 to-gray-500' },
                { name: 'Kenji Tanaka', xp: '35,600 XP', emoji: '🐉', color: 'from-[#CD7F32] to-[#8C5212]' },
              ].map((user, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#2A2A2A]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center font-bold text-sm text-gray-500">{idx+1}</div>
                    <div className="w-10 h-10 rounded-full bg-[#1E1E1E] flex items-center justify-center text-xl">{user.emoji}</div>
                    <span className="font-bold text-sm font-heading">{user.name}</span>
                  </div>
                  <div className={`text-transparent bg-clip-text bg-gradient-to-r font-mono font-bold ${user.color}`}>
                    {user.xp}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
