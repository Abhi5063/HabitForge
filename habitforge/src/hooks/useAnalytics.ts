import { useQuery } from '@tanstack/react-query';

// For UI prototyping since the complex Analytics queries might not exist entirely matching the requested shape in the given backend snapshot
// We mock out the specific Recharts shapes securely here to prevent fatal 500s during dev showcase

const MOCK_LINE_DATA = Array.from({length: 90}).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (89 - i));
    return { date: d.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}), completions: Math.floor(Math.random() * 5), xp: Math.floor(Math.random() * 200) };
});
const MOCK_BAR_DATA = Array.from({length: 30}).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    return { date: d.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}), habitXP: Math.floor(Math.random() * 200), pathXP: Math.floor(Math.random() * 150) };
});
const MOCK_RADIAL_DATA = [
    { name: 'Morning Run', completionRate: 92, color: '#FF6B00' },
    { name: 'Read 20 Pages', completionRate: 75, color: '#FFD700' },
    { name: 'Meditate', completionRate: 45, color: '#22C55E' },
    { name: 'Code 1hr', completionRate: 88, color: '#A855F7' },
    { name: 'Drink Water', completionRate: 100, color: '#00BFA5' }
];

const MOCK_HEATMAP_DATA = Array.from({length: 364}).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (363 - i));
    // Simulate denser clusters recently
    const max = i > 300 ? 10 : 4;
    const count = Math.random() > 0.3 ? Math.floor(Math.random() * max) : 0;
    return { date: d.toISOString(), count };
});

export function useAnalytics(timeRange: string) {
    const queryInfo = useQuery({
        queryKey: ['analytics', 'deep', timeRange],
        queryFn: async () => {
            // Simulated Fetch delay
            await new Promise(r => setTimeout(r, 600));
            return {
                lineData: MOCK_LINE_DATA.slice(-(timeRange === '7D' ? 7 : timeRange === '30D' ? 30 : 90)),
                barData: MOCK_BAR_DATA.slice(-(timeRange === '7D' ? 7 : timeRange === '30D' ? 30 : 90)),
                radialData: MOCK_RADIAL_DATA,
                heatmapData: MOCK_HEATMAP_DATA,
                streaks: [
                    { name: 'Drink Water', currentStreak: 45 },
                    { name: 'Morning Run', currentStreak: 12 },
                    { name: 'Meditate', currentStreak: 2 }
                ],
                bestStreakEver: 125,
                records: { mostXpDay: 1450, longestStreak: 125, totalHabits: 2843, totalDaysActive: 412 },
                badges: [
                    { id: '1', name: 'First Blood', rarity: 'Common', criteria: 'Complete 1 habit', icon: '🩸', earnedAt: '2023-01-15' },
                    { id: '2', name: 'Consistency', rarity: 'Uncommon', criteria: '3 day streak', icon: '⏱️', earnedAt: '2023-01-18' },
                    { id: '3', name: 'Iron Will', rarity: 'Rare', criteria: '30 day streak', icon: '🛡️', earnedAt: '2023-02-15' },
                    { id: '4', name: 'Centurion', rarity: 'Epic', criteria: '100 day streak', icon: '⚡', earnedAt: '2023-05-12' },
                    { id: '5', name: 'Legend', rarity: 'Legendary', criteria: '365 day streak', icon: '👑', earnedAt: null }
                ] as any
            };
        }
    });

    return {
        data: queryInfo.data,
        isLoading: queryInfo.isLoading
    };
}
