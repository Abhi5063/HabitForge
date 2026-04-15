'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Activity } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

import { TimeRangeSelector } from '@/components/analytics/time-range-selector';
import { CompletionLineChart } from '@/components/analytics/completion-line-chart';
import { XPBarChart } from '@/components/analytics/xp-bar-chart';
import { HabitBreakdownChart } from '@/components/analytics/habit-breakdown-chart';
import { ActivityHeatmap } from '@/components/analytics/activity-heatmap';
import { StreakStatsCard } from '@/components/analytics/streak-stats-card';
import { PersonalRecordsCard } from '@/components/analytics/personal-records-card';
import { BadgeShowcase } from '@/components/analytics/badge-showcase';

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D'>('30D');
    const { data, isLoading } = useAnalytics(timeRange);

    if (isLoading || !data) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-[#FF6B00]">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="font-mono text-sm tracking-widest uppercase animate-pulse">Aggregating telemetry...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-[#2A2A2A] pb-6">
                <div>
                    <h1 className="text-4xl font-display tracking-wide mb-2 flex items-center gap-3">
                        <Activity className="w-8 h-8 text-[#FF6B00]" /> SYSTEM ANALYTICS
                    </h1>
                    <p className="text-gray-400 font-mono text-sm">Comprehensive performance metrics and long-term standing.</p>
                </div>
                <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
            </div>

            <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
                className="space-y-6"
            >
                {/* Row 2: Completion Line Chart (Full Width) */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <CompletionLineChart data={data.lineData} />
                </motion.div>

                {/* Row 3: XP Bar Chart (60%) + Streak Stats (40%) */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3">
                        <XPBarChart data={data.barData} />
                    </div>
                    <div className="lg:col-span-2">
                        <StreakStatsCard streaks={data.streaks} bestStreakEver={data.bestStreakEver} />
                    </div>
                </motion.div>

                {/* Row 4: Activity Heatmap (Full Width) */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <ActivityHeatmap data={data.heatmapData} />
                </motion.div>

                {/* Row 5: Habit Breakdown (50%) + Personal Records (50%) */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <HabitBreakdownChart data={data.radialData} />
                    <PersonalRecordsCard {...data.records} />
                </motion.div>

                {/* Row 6: Badge Showcase */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <BadgeShowcase badges={data.badges} />
                </motion.div>
            </motion.div>
        </div>
    );
}
