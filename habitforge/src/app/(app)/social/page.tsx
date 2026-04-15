'use client';

import * as Tabs from '@radix-ui/react-tabs';
import { Users, Trophy, Flag, Loader2 } from 'lucide-react';
import { useSocial } from '@/hooks/useSocial';
import { GlobalLeaderboard } from '@/components/social/global-leaderboard';
import { FriendsList } from '@/components/social/friends-list';
import { GroupsPanel } from '@/components/social/groups-panel';

export default function SocialPage() {
    const { leaderboard, friendsData, groupsData, isLoading } = useSocial();

    if (isLoading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-[#FFD700]">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="font-mono">Syncing global ladders...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <div className="mb-8">
                <h1 className="text-4xl font-display tracking-wide mb-2">FORGE NETWORK</h1>
                <p className="text-gray-400 font-mono text-sm max-w-md">Compete globally, squad up with friends, and conquer collective group challenges.</p>
            </div>

            <Tabs.Root defaultValue="leaderboard" className="w-full">
                <Tabs.List className="flex border-b border-[#2A2A2A] mb-8 overflow-x-auto custom-scrollbar">
                    <Tabs.Trigger value="leaderboard" className="relative px-6 py-4 text-sm font-bold tracking-wider uppercase text-gray-500 data-[state=active]:text-[#FF6B00] transition-colors group whitespace-nowrap">
                        <span className="flex items-center gap-2"><Trophy className="w-4 h-4" /> Leaderboard</span>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF6B00] scale-x-0 group-data-[state=active]:scale-x-100 transition-transform origin-left" />
                    </Tabs.Trigger>
                    <Tabs.Trigger value="friends" className="relative px-6 py-4 text-sm font-bold tracking-wider uppercase text-gray-500 data-[state=active]:text-[#FF6B00] transition-colors group whitespace-nowrap">
                        <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Friends <span className="bg-[#2A2A2A] text-white text-[10px] px-2 rounded ml-1 group-data-[state=active]:bg-[#FF6B00] transition-colors">3</span></span>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF6B00] scale-x-0 group-data-[state=active]:scale-x-100 transition-transform origin-left" />
                    </Tabs.Trigger>
                    <Tabs.Trigger value="groups" className="relative px-6 py-4 text-sm font-bold tracking-wider uppercase text-gray-500 data-[state=active]:text-[#FF6B00] transition-colors group whitespace-nowrap">
                        <span className="flex items-center gap-2"><Flag className="w-4 h-4" /> Groups</span>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF6B00] scale-x-0 group-data-[state=active]:scale-x-100 transition-transform origin-left" />
                    </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="leaderboard" className="outline-none">
                    <GlobalLeaderboard leaderboardData={leaderboard} />
                </Tabs.Content>
                
                <Tabs.Content value="friends" className="outline-none">
                    <FriendsList friendsData={friendsData} />
                </Tabs.Content>

                <Tabs.Content value="groups" className="outline-none">
                    <GroupsPanel groupsData={groupsData} />
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
}
