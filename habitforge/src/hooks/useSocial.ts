import { useQuery } from '@tanstack/react-query';

export function useSocial() {
    // Mock user logic
    const currentUser = { id: 'user-0', name: 'You', xp: 21450, level: 12, emoji: '😎' };

    const leaderboardQuery = useQuery({
        queryKey: ['social', 'leaderboard'],
        queryFn: async () => {
            await new Promise(r => setTimeout(r, 600));
            // Provide 15 players for leaderboard simulation
            const rankings = [
                { id: 'usr-1', name: 'Arjun Sharma', xp: 85200, level: 42, emoji: '🦁', streak: 120, rankArrow: 'UP' },
                { id: 'usr-2', name: 'Priya Nair', xp: 72100, level: 38, emoji: '🦊', streak: 84, rankArrow: 'DOWN' },
                { id: 'usr-3', name: 'Kenji Tanaka', xp: 68600, level: 35, emoji: '🐉', streak: 45, rankArrow: 'NONE' },
                { id: 'usr-4', name: 'Sofia Reyes', xp: 55400, level: 29, emoji: '🌺', streak: 32, rankArrow: 'UP' },
                { id: 'usr-5', name: 'Marcus Webb', xp: 48500, level: 24, emoji: '🦅', streak: 15, rankArrow: 'UP' }
            ];
            // Simulate your insertion at rank 12 out of 523
            const fullList = [...rankings];
            for (let i = 6; i <= 15; i++) {
                if (i === 12) fullList.push({...currentUser, streak: 14, rankArrow: 'UP'} as any);
                else fullList.push({ id: `usr-${i}`, name: `Player ${i}`, xp: 48000 - i * 1000, level: 20, emoji: '👤', streak: 5, rankArrow: 'NONE' });
            }
            return {
                data: fullList,
                userRank: 12,
                totalPlayers: 523
            };
        }
    });

    const friendsQuery = useQuery({
        queryKey: ['social', 'friends'],
        queryFn: async () => {
            return {
                friends: [
                    { id: 'usr-4', name: 'Sofia Reyes', xp: 55400, level: 29, emoji: '🌺', streak: 32 },
                    { id: 'usr-5', name: 'Marcus Webb', xp: 48500, level: 24, emoji: '🦅', streak: 15 }
                ],
                pending: {
                    incoming: [{ id: 'usr-8', name: 'Nina Patel', level: 12, emoji: '🌸' }],
                    outgoing: [{ id: 'usr-9', name: 'David Kim', level: 18, emoji: '🐯' }]
                }
            };
        }
    });

    const groupsQuery = useQuery({
        queryKey: ['social', 'groups'],
        queryFn: async () => {
            return {
                myGroups: [
                    { id: 'grp-1', name: '30 Days of Code', icon: '💻', memberCount: 14, xpGoal: 50000, currentXp: 32000, daysRemaining: 12 }
                ],
                discoverGroups: [
                    { id: 'grp-2', name: 'Fitness Fanatics', icon: '🏃', memberCount: 156, xpGoal: 100000, currentXp: 45000, daysRemaining: 5 }
                ]
            };
        }
    });

    return {
        leaderboard: leaderboardQuery.data,
        friendsData: friendsQuery.data,
        groupsData: groupsQuery.data,
        isLoading: leaderboardQuery.isLoading
    };
}
