'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { useMemo } from 'react';

interface Props {
    data: { date: string; count: number }[]; // Needs 365 days of data ideally
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ActivityHeatmap({ data }: Props) {
    // Helper to determine color intensity based strictly on instructions
    const getColor = (count: number) => {
        if (count === 0) return '#1E1E1E';
        if (count <= 2) return '#FF6B0033'; // 20%
        if (count <= 4) return '#FF6B0077'; // 46%
        if (count <= 7) return '#FF6B00BB'; // 73%
        return '#FF6B00'; // 100%
    };

    // Pad data to ensure it fits a 52x7 week grid (364 days). Assume data comes pre-sorted from earliest to latest.
    const normalizedData = useMemo(() => {
        const weeks = [];
        let currentWeek = [];
        for (let i = 0; i < data.length; i++) {
            currentWeek.push(data[i]);
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        }
        if (currentWeek.length > 0) weeks.push(currentWeek); // partial week
        return weeks;
    }, [data]);

    return (
        <div className="w-full bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 overflow-hidden">
            <h3 className="font-heading font-bold text-gray-400 mb-6 uppercase tracking-wider text-sm flex justify-between">
                <span>Annual Activity</span>
                <span className="text-[#FF6B00]">{data.reduce((acc, d) => acc + d.count, 0)} Completions</span>
            </h3>

            <div className="flex">
                {/* Y-Axis Labels */}
                <div className="flex flex-col gap-[4px] text-[10px] text-gray-500 font-mono mt-5 pr-2">
                    <span className="h-[12px]"></span>
                    <span className="h-[12px] leading-[12px]">Mon</span>
                    <span className="h-[12px]"></span>
                    <span className="h-[12px] leading-[12px]">Wed</span>
                    <span className="h-[12px]"></span>
                    <span className="h-[12px] leading-[12px]">Fri</span>
                    <span className="h-[12px]"></span>
                </div>

                {/* Heatmap Grid Wrapper (horizontally scrollable if needed) */}
                <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
                    {/* X-Axis Placeholder for Months (simplified, normally requires date parsing to align to columns) */}
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono mb-2 px-2 min-w-[700px]">
                        {MONTHS.map(m => <span key={m}>{m}</span>)}
                    </div>
                    
                    <Tooltip.Provider>
                        <div className="flex gap-[4px] min-w-[700px]">
                            {normalizedData.map((week, wIdx) => (
                                <div key={wIdx} className="flex flex-col gap-[4px]">
                                    {week.map((day, dIdx) => (
                                        <Tooltip.Root key={`${wIdx}-${dIdx}`} delayDuration={100}>
                                            <Tooltip.Trigger asChild>
                                                <div 
                                                    className="w-[12px] h-[12px] rounded-sm hover:ring-2 hover:ring-white transition-all cursor-crosshair"
                                                    style={{ backgroundColor: getColor(day.count) }}
                                                />
                                            </Tooltip.Trigger>
                                            <Tooltip.Portal>
                                                <Tooltip.Content className="bg-[#0A0A0A] border border-[#2A2A2A] text-white text-xs px-3 py-2 rounded shadow-xl font-mono" sideOffset={5}>
                                                    <span className="text-[#FF6B00] font-bold">{day.count}</span> habits completed on {new Date(day.date).toLocaleDateString()}
                                                    <Tooltip.Arrow className="fill-[#0A0A0A]" />
                                                </Tooltip.Content>
                                            </Tooltip.Portal>
                                        </Tooltip.Root>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </Tooltip.Provider>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 text-xs font-mono text-gray-500">
                Less
                <div className="flex gap-1">
                    {[0, 1, 3, 5, 8].map(count => (
                        <div key={count} className="w-[12px] h-[12px] rounded-sm" style={{ backgroundColor: getColor(count) }} />
                    ))}
                </div>
                More
            </div>
        </div>
    );
}
