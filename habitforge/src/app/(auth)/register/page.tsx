'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Flame, Loader2, CheckCircle2, ShieldCheck, Trophy, Target, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OAuthButtons } from '@/components/auth/oauth-buttons';

const registerSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  terms: z.boolean().refine(val => val === true, "You must accept the terms")
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
        terms: false
    }
  });

  const passwordValue = watch('password');

  useEffect(() => {
    let strength = 0;
    if (passwordValue?.length >= 8) strength++;
    if (passwordValue?.match(/[A-Z]/)) strength++;
    if (passwordValue?.match(/[0-9]/)) strength++;
    if (passwordValue?.match(/[^a-zA-Z0-9]/)) strength++;
    setPasswordStrength(Math.min(strength, 3));
  }, [passwordValue]);

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: data.email,
            username: data.username,
            displayName: data.displayName,
            password: data.password
        })
      });
      
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.message || 'Registration failed');
      
      localStorage.setItem('accessToken', payload.accessToken);
      
      toast.success('Welcome to HabitForge! 🔥');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
      if (passwordStrength === 0) return 'bg-[#2A2A2A]';
      if (passwordStrength === 1) return 'bg-red-500 w-1/3';
      if (passwordStrength === 2) return 'bg-[#FFD700] w-2/3';
      return 'bg-[#22C55E] w-full';
  };

  return (
    <div className="w-full flex min-h-screen">
      {/* Left side: Form */}
      <div className="w-full lg:w-[45%] p-8 flex flex-col justify-center bg-[#0A0A0A] overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto py-12"
        >
          <div className="flex items-center gap-2 text-xl font-display tracking-wide mb-8">
            <Flame className="w-6 h-6 text-[#FF6B00]" />
            <span>HABITFORGE</span>
          </div>

          <h1 className="font-heading text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-gray-400 mb-6 font-body text-sm">Join thousands of relentless forgers.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Display Name</label>
                <Input 
                    placeholder="Arjun" 
                    {...register('displayName')}
                    className={`bg-[#141414] border-[#2A2A2A] h-11 focus:border-[#FF6B00] ${errors.displayName ? 'border-red-500' : ''}`}
                />
                {errors.displayName && <p className="text-red-500 text-[10px]">{errors.displayName.message}</p>}
                </div>

                <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Username</label>
                <Input 
                    placeholder="arjun_01" 
                    {...register('username')}
                    className={`bg-[#141414] border-[#2A2A2A] h-11 focus:border-[#FF6B00] ${errors.username ? 'border-red-500' : ''}`}
                />
                {errors.username && <p className="text-red-500 text-[10px]">{errors.username.message}</p>}
                </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Email Address</label>
              <Input 
                type="email" 
                placeholder="you@email.com" 
                {...register('email')}
                className={`bg-[#141414] border-[#2A2A2A] h-11 focus:border-[#FF6B00] ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-[10px]">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                {...register('password')}
                className={`bg-[#141414] border-[#2A2A2A] h-11 focus:border-[#FF6B00] ${errors.password ? 'border-red-500' : ''}`}
              />
              {/* Strength Indicator */}
              <div className="h-1 w-full bg-[#2A2A2A] rounded-full mt-2 overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${getStrengthColor()}`} />
              </div>
              {errors.password && <p className="text-red-500 text-[10px]">{errors.password.message}</p>}
            </div>

            <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="terms" {...register('terms')} className="w-4 h-4 rounded border-[#2A2A2A] bg-[#141414] text-[#FF6B00] focus:ring-[#FF6B00]" />
                <label htmlFor="terms" className="text-xs text-gray-400">
                    I agree to the <span className="text-[#FF6B00]">Terms</span> and <span className="text-[#FF6B00]">Privacy Policy</span>
                </label>
            </div>
            {errors.terms && <p className="text-red-500 text-[10px] pl-6 mt-0">{errors.terms.message}</p>}

            <Button 
              type="submit" 
              className="w-full bg-[#FF6B00] hover:bg-[#FFD700] hover:text-black text-white h-12 font-bold text-lg mt-4 transition-all"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Begin My Quest'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2A2A2A]"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-[#0A0A0A] px-4 text-gray-500">Or continue with</span>
            </div>
          </div>

          <OAuthButtons />

          <p className="mt-6 text-center text-xs text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-[#FF6B00] hover:text-[#FFD700] font-bold">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side: Visuals (Hidden on Mobile) */}
      <div className="hidden lg:flex w-[55%] relative flex-col justify-center items-center overflow-hidden bg-[#141414] border-l border-[#2A2A2A]">
        <div className="absolute inset-0 z-0">
          <div className="absolute bottom-[20%] right-[30%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,_rgba(255,107,0,0.15)_0%,_transparent_70%)] blur-[40px]" />
          <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,_rgba(34,197,94,0.1)_0%,_transparent_70%)] blur-[60px]" />
        </div>

        <div className="z-10 w-full max-w-lg text-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-7xl font-display text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 mb-16 leading-none"
          >
            YOUR <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FF6B00]">JOURNEY</span> <br/>
            STARTS NOW
          </motion.h2>

          {/* Badge Preview */}
          <div className="grid grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#1E1E1E] border border-[#FF6B00] rounded-2xl p-6 text-center shadow-[0_0_20px_rgba(255,107,0,0.2)]">
                  <div className="w-16 h-16 rounded-full bg-[#FF6B00]/20 mx-auto flex items-center justify-center mb-4">
                    <Target className="w-8 h-8 text-[#FF6B00]" />
                  </div>
                  <h3 className="font-bold font-heading">First Step</h3>
                  <p className="text-xs text-gray-400 mt-1">Unlock instantly</p>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 text-center opacity-50 filter grayscale">
                  <div className="w-16 h-16 rounded-full bg-[#2A2A2A] mx-auto flex items-center justify-center mb-4">
                    <ShieldCheck className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="font-bold font-heading text-gray-500">Iron Will</h3>
                  <p className="text-xs text-gray-600 mt-1">Locked</p>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 text-center opacity-50 filter grayscale">
                  <div className="w-16 h-16 rounded-full bg-[#2A2A2A] mx-auto flex items-center justify-center mb-4">
                    <Zap className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="font-bold font-heading text-gray-500">Centurion</h3>
                  <p className="text-xs text-gray-600 mt-1">Locked</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 text-center opacity-50 filter grayscale">
                  <div className="w-16 h-16 rounded-full bg-[#2A2A2A] mx-auto flex items-center justify-center mb-4">
                    <Trophy className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="font-bold font-heading text-gray-500">Legends</h3>
                  <p className="text-xs text-gray-600 mt-1">Locked</p>
              </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
