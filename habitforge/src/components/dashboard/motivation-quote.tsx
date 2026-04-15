'use client';

import { Quote, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export function MotivationQuote({ quote, author, onRefresh }: { quote: string, author: string, onRefresh: () => void }) {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRefresh = () => {
      setIsSpinning(true);
      onRefresh();
      setTimeout(() => setIsSpinning(false), 1000);
  };

  return (
    <div className="bg-[#141414] border-l-4 border-l-[#FF6B00] border-y border-y-[#2A2A2A] border-r border-r-[#2A2A2A] rounded-r-2xl p-6 relative group overflow-hidden">
        <div className="absolute top-4 right-4 opacity-5 pointer-events-none">
            <Quote className="w-24 h-24 text-[#FF6B00]" />
        </div>

        <button 
           onClick={handleRefresh}
           className="absolute top-4 right-4 text-gray-600 hover:text-[#FFD700] transition-colors"
           title="New Quote"
        >
            <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
        </button>

        <div className="relative z-10 pr-8">
            <p className="font-heading italic text-lg leading-relaxed text-gray-300 mb-4 tracking-wide">
                "{quote}"
            </p>
            <p className="text-[#FF6B00] font-bold text-sm tracking-wider uppercase">
                — {author}
            </p>
        </div>
    </div>
  );
}
