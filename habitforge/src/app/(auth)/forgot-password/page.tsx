'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Flame, Loader2, ArrowLeft, Mail, KeyRound, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const emailSchema = z.object({ email: z.string().email('Please enter a valid email') });
const otpSchema = z.object({ otp: z.string().length(6, 'OTP must be exactly 6 digits') });
const passwordSchema = z.object({ 
    password: z.string().min(8, 'Must be at least 8 chars'),
    confirm: z.string()
}).refine(data => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"]
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register: registerEmail, handleSubmit: handleEmailSubmit, formState: { errors: emailErrors } } = useForm({
    resolver: zodResolver(emailSchema)
  });

  const { register: registerOtp, handleSubmit: handleOtpSubmit, formState: { errors: otpErrors } } = useForm({
    resolver: zodResolver(otpSchema)
  });

  const { register: registerPwd, handleSubmit: handlePwdSubmit, formState: { errors: pwdErrors } } = useForm({
    resolver: zodResolver(passwordSchema)
  });

  const onEmailSubmit = async (data: { email: string }) => {
      setIsLoading(true);
      try {
          // Assume fake request for simplicity, mapped to backend
          await fetch('http://localhost:4000/auth/forgot-password', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
          });
          setEmail(data.email);
          setStep(2);
      } catch (err: any) {
          toast.error('Failed to send reset code');
      } finally {
          setIsLoading(false);
      }
  };

  const onOtpSubmit = (data: { otp: string }) => {
      setOtp(data.otp);
      setStep(3); // In actual flow, you'd just send OTP with the new password in step 3
  };

  const onPwdSubmit = async (data: any) => {
      setIsLoading(true);
      try {
        const res = await fetch('http://localhost:4000/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, newPassword: data.password })
        });
        if (!res.ok) throw new Error('Reset failed');
        toast.success('Password successfully reset!');
        router.push('/login');
      } catch (err: any) {
          toast.error(err.message);
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="w-full flex min-h-[100dvh] items-center justify-center p-6 bg-[#0A0A0A] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,_rgba(255,107,0,0.1)_0%,_transparent_70%)] blur-[40px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,_rgba(255,215,0,0.05)_0%,_transparent_70%)] blur-[40px] pointer-events-none" />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-[#141414] border border-[#2A2A2A] rounded-2xl shadow-2xl relative z-10 overflow-hidden"
      >
          {/* Progress Bar Top */}
          <div className="h-1 w-full bg-[#1A1A1A] flex">
              <div className={`h-full bg-[#FF6B00] transition-all duration-500`} style={{ width: `${(step / 3) * 100}%` }} />
          </div>

          <div className="p-8">
              <Link href="/login" className="inline-flex items-center text-gray-500 hover:text-white text-xs mb-8 transition-colors">
                  <ArrowLeft className="w-3 h-3 mr-1" /> Back to Login
              </Link>

              <AnimatePresence mode="wait">
                  {step === 1 && (
                      <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                          <Mail className="w-10 h-10 text-[#FF6B00] mb-4" />
                          <h2 className="text-2xl font-heading font-bold mb-2">Reset Password</h2>
                          <p className="text-gray-400 text-sm mb-6">Enter your email and we'll send you a 6-digit verification code.</p>
                          <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-4">
                              <div>
                                  <Input placeholder="you@email.com" {...registerEmail('email')} className="bg-[#0A0A0A] border-[#2A2A2A] focus:border-[#FF6B00] h-12" />
                                  {emailErrors.email && <p className="text-red-500 text-xs mt-1">{emailErrors.email.message?.toString()}</p>}
                              </div>
                              <Button type="submit" className="w-full bg-[#FF6B00] hover:bg-[#FFD700] hover:text-black text-white h-12 font-bold" disabled={isLoading}>
                                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Send Reset Code'}
                              </Button>
                          </form>
                      </motion.div>
                  )}

                  {step === 2 && (
                      <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                          <KeyRound className="w-10 h-10 text-[#FFD700] mb-4" />
                          <h2 className="text-2xl font-heading font-bold mb-2">Enter OTP</h2>
                          <p className="text-gray-400 text-sm mb-6">Code sent to <span className="text-white">{email}</span></p>
                          <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-4">
                              <div>
                                  <Input placeholder="123456" maxLength={6} {...registerOtp('otp')} className="bg-[#0A0A0A] border-[#2A2A2A] focus:border-[#FFD700] h-12 text-center text-2xl tracking-[1em] font-mono" />
                                  {otpErrors.otp && <p className="text-red-500 text-xs mt-1 text-center">{otpErrors.otp.message?.toString()}</p>}
                              </div>
                              <Button type="submit" className="w-full bg-[#FFD700] hover:bg-white text-black h-12 font-bold" disabled={isLoading}>
                                  Verify Code
                              </Button>
                          </form>
                      </motion.div>
                  )}

                  {step === 3 && (
                      <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                          <CheckCircle2 className="w-10 h-10 text-[#22C55E] mb-4" />
                          <h2 className="text-2xl font-heading font-bold mb-2">New Password</h2>
                          <p className="text-gray-400 text-sm mb-6">Create a strong new password for your account.</p>
                          <form onSubmit={handlePwdSubmit(onPwdSubmit)} className="space-y-4">
                              <div>
                                  <Input type="password" placeholder="New password" {...registerPwd('password')} className="bg-[#0A0A0A] border-[#2A2A2A] focus:border-[#22C55E] h-12 mb-2" />
                                  {pwdErrors.password && <p className="text-red-500 text-xs mb-2">{pwdErrors.password.message?.toString()}</p>}
                                  
                                  <Input type="password" placeholder="Confirm password" {...registerPwd('confirm')} className="bg-[#0A0A0A] border-[#2A2A2A] focus:border-[#22C55E] h-12" />
                                  {pwdErrors.confirm && <p className="text-red-500 text-xs mt-1">{pwdErrors.confirm.message?.toString()}</p>}
                              </div>
                              <Button type="submit" className="w-full bg-[#22C55E] hover:bg-white text-black h-12 font-bold" disabled={isLoading}>
                                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm Reset'}
                              </Button>
                          </form>
                      </motion.div>
                  )}
              </AnimatePresence>
          </div>
      </motion.div>
    </div>
  );
}
