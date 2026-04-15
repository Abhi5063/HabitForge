'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, SkipForward, Maximize2, Minimize2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

type TimerMode = 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK';

const DURATIONS = {
    WORK: 25 * 60,
    SHORT_BREAK: 5 * 60,
    LONG_BREAK: 15 * 60
};

const COLORS = {
    WORK: '#FF6B00',
    SHORT_BREAK: '#22C55E',
    LONG_BREAK: '#FFD700'
};

export default function FocusPage() {
    const [mode, setMode] = useState<TimerMode>('WORK');
    const [timeLeft, setTimeLeft] = useState(DURATIONS.WORK);
    const [isRunning, setIsRunning] = useState(false);
    const [sessionCount, setSessionCount] = useState(1);
    const [isAmbient, setIsAmbient] = useState(false);
    
    // Select mock habit linking
    const [linkedHabit, setLinkedHabit] = useState('Deep Work Session');
    
    // Logs
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (isRunning && timeLeft === 0) {
            handleTimerComplete();
        }
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRunning, timeLeft]);

    const playBell = () => {
        try {
            const ctx = new window.AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 1.5);
            gain.gain.setValueAtTime(0.5, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 1.5);
        } catch(e) { console.error('AudioContext fails gracefully on restricted interactions', e); }
    };

    const handleTimerComplete = () => {
        setIsRunning(false);
        playBell();

        if (mode === 'WORK') {
            const nextCount = sessionCount + 1;
            setSessionCount(nextCount);
            
            // Log addition
            setLogs(prev => [{ time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), duration: 25, habit: linkedHabit, xp: 50 }, ...prev]);

            if (nextCount > 4) {
                setMode('LONG_BREAK');
                setTimeLeft(DURATIONS.LONG_BREAK);
                setSessionCount(1);
            } else {
                setMode('SHORT_BREAK');
                setTimeLeft(DURATIONS.SHORT_BREAK);
            }
        } else {
            setMode('WORK');
            setTimeLeft(DURATIONS.WORK);
        }
    };

    const skipSession = () => {
        setIsRunning(false);
        handleTimerComplete();
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(DURATIONS[mode]);
    };

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const progressPct = ((DURATIONS[mode] - timeLeft) / DURATIONS[mode]) * 100;
    const strokeDashoffset = 880 - (progressPct / 100) * 880; // 2 * PI * 140 = ~880

    if (isAmbient) {
        return (
            <div className="fixed inset-0 z-50 bg-[#0A0A0A] flex flex-col items-center justify-center" onClick={() => setIsAmbient(false)}>
                 <div className="relative w-[80vmin] h-[80vmin] flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle cx="50%" cy="50%" r="45%" stroke="#141414" strokeWidth="8" fill="none" />
                        <circle cx="50%" cy="50%" r="45%" stroke={COLORS[mode]} strokeWidth="8" fill="none" strokeDasharray="283%" strokeDashoffset={`${283 - (progressPct / 100) * 283}%`} className="transition-all duration-1000 ease-linear" />
                    </svg>
                    <div className="text-[20vmin] font-display tracking-widest text-white leading-none whitespace-nowrap">{formatTime(timeLeft)}</div>
                 </div>
                 <p className="mt-8 text-gray-500 font-mono text-xs uppercase animate-pulse">Click anywhere to exit</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                   <h1 className="text-4xl font-display tracking-wide mb-1 text-white">FORGE TIMER</h1>
                   <p className="text-gray-400 font-mono text-sm">Deep work terminal. Every session yields XP.</p>
                </div>
                <Button variant="ghost" onClick={() => setIsAmbient(true)} className="text-gray-400 hover:text-white">
                    <Maximize2 className="w-5 h-5" />
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
                {/* Timer Clock Interface */}
                <div className="flex flex-col items-center justify-center bg-[#141414] border border-[#2A2A2A] rounded-[3rem] p-10 min-h-[500px]">
                    <div className="flex gap-4 mb-10 bg-[#0A0A0A] p-1 rounded-full border border-[#2A2A2A]">
                        {(['WORK', 'SHORT_BREAK', 'LONG_BREAK'] as TimerMode[]).map(m => (
                            <button 
                                key={m} 
                                onClick={() => { setMode(m); setTimeLeft(DURATIONS[m]); setIsRunning(false); }}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${mode === m ? `text-black bg-white` : 'text-gray-500 hover:text-gray-300'}`}
                                style={mode === m ? { backgroundColor: COLORS[m] } : {}}
                            >
                                {m.replace('_', ' ')}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-72 h-72 flex items-center justify-center mb-12">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90 filter drop-shadow-[0_0_20px_rgba(255,107,0,0.1)]">
                            <circle cx="144" cy="144" r="140" stroke="#0A0A0A" strokeWidth="8" fill="none" />
                            <circle cx="144" cy="144" r="140" stroke={COLORS[mode]} strokeWidth="8" fill="none" strokeDasharray="880" strokeDashoffset={strokeDashoffset} className="transition-all duration-1000 ease-linear" />
                        </svg>
                        <div className="flex flex-col items-center z-10">
                             <div className="text-7xl font-display tracking-widest text-white mt-4">{formatTime(timeLeft)}</div>
                             <div className="text-xs font-mono font-bold text-gray-500 uppercase mt-2">
                                 {mode === 'WORK' ? `Session ${sessionCount} de 4` : mode === 'SHORT_BREAK' ? 'Short Recovery' : 'Deep Rest'}
                             </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button onClick={resetTimer} className="w-12 h-12 rounded-full border border-[#3A3A3A] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                             <RotateCcw className="w-5 h-5" />
                        </button>
                        <button onClick={() => setIsRunning(!isRunning)} className="w-20 h-20 rounded-full flex items-center justify-center text-black transform hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,107,0,0.4)]" style={{ backgroundColor: COLORS[mode] }}>
                             {isRunning ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-2" />}
                        </button>
                        <button onClick={skipSession} className="w-12 h-12 rounded-full border border-[#3A3A3A] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                             <SkipForward className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Right Rail Details */}
                <div className="space-y-8">
                     <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6">
                         <h3 className="font-heading font-bold text-lg uppercase tracking-wider text-gray-300 mb-4 flex items-center gap-2">Config</h3>
                         <div className="space-y-4">
                             <div>
                                 <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Automated XP Linking</label>
                                 <select 
                                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 text-sm focus:border-[#FF6B00] outline-none font-bold text-white cursor-pointer"
                                    value={linkedHabit} onChange={e => setLinkedHabit(e.target.value)}
                                 >
                                     <option>Deep Work Session</option>
                                     <option>Read 'Clean Code'</option>
                                     <option>Python Algorithm Preps</option>
                                 </select>
                                 <p className="text-[10px] text-gray-500 font-mono mt-2">Completing a 25m work block natively completes this habit and adds the XP mapping silently.</p>
                             </div>
                         </div>
                     </div>

                     <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6">
                         <h3 className="font-heading font-bold text-lg uppercase tracking-wider text-gray-300 mb-4">Today's Log</h3>
                         <div className="space-y-3">
                             {logs.map((L, i) => (
                                 <div key={i} className="flex justify-between items-center bg-[#0A0A0A] p-3 rounded-lg border border-[#3A3A3A] animate-in fade-in slide-in-from-left-4">
                                      <div>
                                          <div className="font-bold text-sm text-white flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#22C55E]"/> {L.habit}</div>
                                          <div className="text-[10px] text-gray-500 font-mono mt-1">{L.time} • {L.duration} min session</div>
                                      </div>
                                      <div className="text-xs font-bold text-[#FFD700] px-2 py-1 bg-[#FFD700]/10 rounded border border-[#FFD700]/20">+{L.xp} XP</div>
                                 </div>
                             ))}
                             {logs.length === 0 && (
                                 <div className="text-center py-6 text-gray-500 font-mono text-sm border-2 border-dashed border-[#2A2A2A] rounded-xl">
                                     No blocks complete today. Burn the midnight oil!
                                 </div>
                             )}
                         </div>
                     </div>
                </div>

            </div>
        </div>
    );
}
