'use client';

interface TimeRangeSelectorProps {
    value: '7D' | '30D' | '90D';
    onChange: (value: '7D' | '30D' | '90D') => void;
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
    return (
        <div className="flex bg-[#141414] p-1 rounded-full border border-[#2A2A2A]">
            {(['7D', '30D', '90D'] as const).map(range => (
                <button
                    key={range}
                    onClick={() => onChange(range)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                        value === range 
                        ? 'bg-[#FF6B00] text-white shadow-lg' 
                        : 'text-gray-500 hover:text-white'
                    }`}
                >
                    {range}
                </button>
            ))}
        </div>
    );
}
