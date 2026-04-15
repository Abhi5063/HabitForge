import { Button } from "@/components/ui/button";

interface Props {
    emoji: string;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export function EmptyState({ emoji, title, description, actionLabel, onAction, className = '' }: Props) {
    return (
        <div className={`flex flex-col items-center justify-center p-12 text-center bg-[#141414] border-2 border-dashed border-[#2A2A2A] rounded-3xl ${className}`}>
             <div className="w-20 h-20 rounded-2xl bg-[#0A0A0A] border border-[#3A3A3A] flex items-center justify-center text-4xl mb-6 shadow-inner filter grayscale">
                 {emoji}
             </div>
             
             <h3 className="font-heading font-bold text-xl uppercase tracking-widest text-white mb-2">{title}</h3>
             <p className="text-sm text-gray-500 font-mono mb-8 max-w-sm">{description}</p>
             
             {actionLabel && onAction && (
                 <Button 
                    onClick={onAction}
                    className="bg-[#1A1A1A] border border-[#3A3A3A] hover:bg-[#FF6B00] hover:border-[#FF6B00] hover:text-white text-gray-300 font-bold transition-colors"
                 >
                     {actionLabel}
                 </Button>
             )}
        </div>
    );
}
