'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, BrainCircuit, Trophy, ArrowRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF6B00] selection:text-white overflow-hidden font-body">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(255,107,0,0.15)_0%,_rgba(10,10,10,0)_70%)]" />
        <div className="absolute top-[30%] left-[10%] w-2 h-2 rounded-full bg-[#FFD700] animate-[ping_4s_ease-in-out_infinite]" />
        <div className="absolute top-[60%] right-[20%] w-3 h-3 rounded-full bg-[#FF6B00] animate-[ping_6s_ease-in-out_infinite_1s]" />
      </div>

      <nav className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-2xl font-display tracking-wide">
          <Flame className="w-8 h-8 text-[#FF6B00]" />
          <span>HABITFORGE</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-gray-300 hover:text-white transition-colors">Log In</Link>
          <Link href="/register">
            <Button className="bg-[#FF6B00] text-white hover:bg-[#FF6B00]/90">Play Now</Button>
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 flex min-h-[calc(100vh-88px)] items-center pt-10 pb-24">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show"
            className="flex flex-col items-start gap-8"
          >
            <motion.h1 
              variants={itemVariants}
              className="font-display text-6xl md:text-8xl leading-[0.9] tracking-wider"
            >
              FORGE YOUR HABITS.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FF6B00]">LEVEL UP YOUR LIFE.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-xl text-gray-400 max-w-lg leading-relaxed">
              The only habit tracker that treats your personal growth like the epic quest it truly is.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-bold text-lg h-14 px-8 rounded-full">
                  Start Forging — It's Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="secondary" className="border-gray-700 text-white hover:bg-gray-800 h-14 px-8 rounded-full font-bold text-lg">
                See How It Works
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-8">
              <div className="bg-[#141414] border border-[#2A2A2A] px-4 py-2 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                <span className="font-mono text-sm">10,000+ Habits Forged</span>
              </div>
              <div className="bg-[#141414] border border-[#2A2A2A] px-4 py-2 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FFD700]" />
                <span className="font-mono text-sm">2.5M XP Earned</span>
              </div>
              <div className="bg-[#141414] border border-[#2A2A2A] px-4 py-2 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                <span className="font-mono text-sm">47K Streak Days</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateX: 15 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative lg:h-[600px] flex items-center justify-center perspective-[1000px]"
          >
            {/* Mockup Card */}
            <div className="base-card p-6 w-full max-w-sm rounded-2xl bg-[#141414] border border-[#2A2A2A] shadow-2xl shadow-[#FF6B00]/10 transform-gpu rotate-y-[-10deg] hover:rotate-y-0 transition-transform duration-700">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-xl bg-[#1E1E1E] flex items-center justify-center border border-[#3A3A3A]">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-heading">Deep Work Block</h3>
                    <p className="text-xs text-gray-500 font-mono">Daily • +150 XP</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-[#FF6B00] font-bold">
                    <Flame className="w-4 h-4 fill-current animate-pulse" />
                    <span>32</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-[#1E1E1E] rounded-lg border border-[#2A2A2A] flex items-center px-4 gap-3 relative overflow-hidden">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
                    <div className="h-2 w-full bg-gray-800 rounded-full" />
                    {i === 1 && (
                      <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
                        className="absolute inset-y-0 left-0 bg-[#FF6B00]/20 w-full"
                      />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-[#2A2A2A] flex justify-between items-center">
                <div className="flex gap-1">
                  <span className="badge-chip border-[#FFD700] text-[#FFD700]">Lvl 8</span>
                  <span className="badge-chip border-[#22C55E] text-[#22C55E]">Epic</span>
                </div>
                <Button className="bg-white text-black hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.3)]">Complete</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-32 bg-[#0F0F0F] relative z-10 border-y border-[#1A1A1A]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl md:text-5xl mb-4">CHOOSE YOUR ARSENAL</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to turn vague aspirations into concrete reality.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -10 }} className="bg-[#141414] p-8 rounded-2xl border-t-4 border-t-[#FF6B00] border-x border-b border-[#2A2A2A] relative group">
              <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/10 flex items-center justify-center mb-6 text-[#FF6B00] group-hover:scale-110 transition-transform">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4">Track Habits</h3>
              <p className="text-gray-400">Flexibly track daily, weekly, or monthly habits. Watch your streaks multiply your XP gains and build unbreakable momentum.</p>
            </motion.div>
            
            <motion.div whileHover={{ y: -10 }} className="bg-[#141414] p-8 rounded-2xl border-t-4 border-t-[#FFD700] border-x border-b border-[#2A2A2A] relative group">
              <div className="w-16 h-16 rounded-2xl bg-[#FFD700]/10 flex items-center justify-center mb-6 text-[#FFD700] group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4">AI Learning Paths</h3>
              <p className="text-gray-400">Tell Gemini your goal. It generates a complete day-by-day curriculum. Execute the tasks, earn XP, and master any skill.</p>
            </motion.div>
            
            <motion.div whileHover={{ y: -10 }} className="bg-[#141414] p-8 rounded-2xl border-t-4 border-t-[#22C55E] border-x border-b border-[#2A2A2A] relative group">
              <div className="w-16 h-16 rounded-2xl bg-[#22C55E]/10 flex items-center justify-center mb-6 text-[#22C55E] group-hover:scale-110 transition-transform">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4">Compete & Connect</h3>
              <p className="text-gray-400">Add friends, join groups, and climb the global leaderboard. Earn legendary badges that prove your relentless consistency.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="font-display text-4xl md:text-5xl mb-4">THE FORGE PROCESS</h2>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-24">
            {[
              { num: '01', title: 'Equip Your Quests', desc: 'Create custom habits or let our AI build structured learning paths for your ultimate goals.', align: 'left' },
              { num: '02', title: 'Grind & Earn', desc: 'Complete your daily objectives to earn XP. Push through resistance and trigger your streak multipliers.', align: 'right' },
              { num: '03', title: 'Ascend the Ranks', desc: 'Level up your profile, unlock impossibly rare badges, and dominate the global leaderboard natively.', align: 'left' }
            ].map((step, idx) => (
              <div key={idx} className={`flex flex-col md:flex-row gap-12 items-center ${step.align === 'right' ? 'md:flex-row-reverse' : ''}`}>
                <div className="md:w-1/2 flex justify-center">
                  <div className="w-32 h-32 rounded-full border border-[#3A3A3A] bg-[#141414] flex items-center justify-center font-display text-6xl text-[#FF6B00]">
                    {step.num}
                  </div>
                </div>
                <div className={`md:w-1/2 text-center md:text-${step.align}`}>
                  <h3 className="font-heading text-3xl font-bold mb-4">{step.title}</h3>
                  <p className="text-xl text-gray-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00] to-[#FFD700] opacity-10" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="font-display text-5xl md:text-7xl mb-8">YOUR STREAK STARTS TODAY</h2>
          <Link href="/register">
            <Button size="lg" className="bg-[#FF6B00] hover:bg-[#FFD700] hover:text-black text-white font-bold text-2xl h-16 px-12 rounded-full transition-all">
              Launch HabitForge
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-12 border-t border-[#1A1A1A] text-center text-gray-500 relative z-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-display text-xl tracking-wider text-gray-300">
            <Flame className="w-5 h-5 text-[#FF6B00]" />
            HABITFORGE
          </div>
          <div className="text-sm font-mono">
            Built with 🔥 for the relentless.
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
