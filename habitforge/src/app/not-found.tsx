import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Flame } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Ambient Ring */}
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[600px] h-[600px] rounded-full border border-[#FF6B00]/10 opacity-50 blur-sm pointer-events-none" />
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[400px] h-[400px] rounded-full border border-[#FFD700]/10 opacity-30 blur-md pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
            <div className="w-24 h-24 bg-[#141414] border border-[#2A2A2A] rounded-3xl flex items-center justify-center shadow-2xl mb-8 transform -rotate-12">
                <Flame className="w-12 h-12 text-[#FF6B00]" />
            </div>

            <h1 className="font-display text-[150px] leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-800 tracking-widest drop-shadow-2xl">404</h1>
            <h2 className="font-heading text-3xl font-bold uppercase tracking-widest text-[#FFD700] mb-4">Void Reached</h2>
            
            <p className="text-gray-400 font-mono mb-10 text-sm">
                The objective you are looking for has been destroyed, relocated, or never existed in this dimension.
            </p>

            <div className="flex gap-4 w-full">
                <Link href="/dashboard" className="flex-1">
                    <Button className="w-full h-14 bg-[#FF6B00] hover:bg-[#FFD700] hover:text-black font-bold text-lg transition-colors border-none">
                        Return to Forge
                    </Button>
                </Link>
                <Button variant="ghost" className="flex-1 h-14 border border-[#2A2A2A] text-gray-400 hover:text-white font-bold bg-[#141414] transition-colors">
                    Report Anomaly
                </Button>
            </div>
        </div>
    </div>
  );
}
