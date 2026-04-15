'use client';

import { Settings, Shield, User, Bell, Palette, HardDrive, LogOut, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/auth.store';

export default function SettingsPage() {
    const { user, clearAuth } = useAuthStore();

    const handleLogout = () => {
        clearAuth();
        window.location.href = '/login';
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-8">
                <h1 className="text-4xl font-display tracking-wide mb-2 flex items-center gap-3">
                    <Settings className="w-8 h-8 text-gray-400" /> SYSTEM CONFIG
                </h1>
                <p className="text-gray-400 font-mono text-sm">Manage preferences, integrations, and critical account parameters.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Internal Side Nav */}
                <div className="md:col-span-1 space-y-1 sticky top-24 h-max">
                    <a href="#profile" className="block px-4 py-2 text-sm font-bold text-white bg-[#1A1A1A] rounded-lg border-l-2 border-[#FF6B00]">Profile Engine</a>
                    <a href="#appearance" className="block px-4 py-2 text-sm font-bold text-gray-500 hover:text-white hover:bg-[#1A1A1A] rounded-lg border-l-2 border-transparent">Display</a>
                    <a href="#notifications" className="block px-4 py-2 text-sm font-bold text-gray-500 hover:text-white hover:bg-[#1A1A1A] rounded-lg border-l-2 border-transparent">Alerts</a>
                    <a href="#data" className="block px-4 py-2 text-sm font-bold text-gray-500 hover:text-white hover:bg-[#1A1A1A] rounded-lg border-l-2 border-transparent">Data Management</a>
                </div>

                <div className="md:col-span-3 space-y-8">
                     {/* PROFILE OVERRIDE */}
                     <section id="profile" className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-8">
                         <h2 className="font-heading font-bold text-xl uppercase tracking-widest text-white mb-6 flex items-center gap-2"><User className="w-5 h-5 text-[#FFD700]"/> Profile Metrics</h2>
                         
                         <div className="flex gap-6 items-start mb-8 pb-8 border-b border-[#2A2A2A]">
                              <div className="flex flex-col items-center gap-3">
                                  <div className="w-24 h-24 rounded-full bg-[#0A0A0A] border-4 border-[#3A3A3A] flex items-center justify-center text-4xl shadow-inner cursor-pointer hover:border-[#FFD700] transition-colors">{user?.avatarEmoji || '😎'}</div>
                                  <span className="text-[10px] text-[#FFD700] font-mono uppercase tracking-widest font-bold">Swap Rune</span>
                              </div>
                              <div className="flex-1 space-y-4">
                                  <div>
                                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Display Name</label>
                                      <Input defaultValue={user?.displayName || 'Unknown Forger'} className="bg-[#0A0A0A] border-[#2A2A2A] mt-1 h-12 font-bold focus:border-[#FFD700]" />
                                  </div>
                                  <div>
                                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Global Hande</label>
                                      <Input defaultValue={user?.username || '@unknown'} disabled className="bg-[#0A0A0A]/50 border-[#2A2A2A]/50 mt-1 h-12 text-gray-500 font-mono tracking-wider cursor-not-allowed" />
                                  </div>
                              </div>
                         </div>

                         <div className="space-y-4">
                             <h3 className="font-bold text-sm text-gray-300 uppercase tracking-widest">Authentication Array</h3>
                             <div>
                                  <label className="text-xs font-bold text-gray-500 uppercase">Registered Email</label>
                                  <Input defaultValue={user?.email || 'no-email@error.com'} disabled className="bg-[#0A0A0A] border-[#2A2A2A] mt-1 h-12 text-gray-500" />
                             </div>
                             <div>
                                  <label className="text-xs font-bold text-gray-500 uppercase">Change Security Hash (Password)</label>
                                  <Input type="password" placeholder="Enter new password" className="bg-[#0A0A0A] border-[#2A2A2A] mt-1 h-12 focus:border-red-500" />
                                  <p className="text-[10px] font-mono text-gray-500 mt-1">Leave blank to maintain current encryption parameters.</p>
                             </div>
                         </div>
                         <div className="mt-8 pt-4">
                             <Button className="bg-[#FFD700] text-black hover:bg-white font-bold h-12 px-8">Sync Changes</Button>
                         </div>
                     </section>

                     {/* DISPLAY PREFS */}
                     <section id="appearance" className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-8">
                         <h2 className="font-heading font-bold text-xl uppercase tracking-widest text-white mb-6 flex items-center gap-2"><Palette className="w-5 h-5 text-[#FF6B00]"/> Visual Directives</h2>
                         <div className="space-y-6">
                             <div className="flex items-center justify-between p-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl">
                                 <div>
                                     <h4 className="font-bold text-white">Strict Dark Mode</h4>
                                     <p className="text-xs text-gray-500">Lock the application into deep space black natively.</p>
                                 </div>
                                 <div className="w-12 h-6 rounded-full bg-[#FF6B00] relative">
                                    <div className="w-4 h-4 rounded-full bg-white absolute top-1 translate-x-7" />
                                 </div>
                             </div>
                             <div className="flex items-center justify-between p-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl">
                                 <div>
                                     <h4 className="font-bold text-white">Include Profile on Leaderboards</h4>
                                     <p className="text-xs text-gray-500">Expose your metrics to the World and Friends ladders.</p>
                                 </div>
                                 <div className="w-12 h-6 rounded-full bg-[#FF6B00] relative">
                                    <div className="w-4 h-4 rounded-full bg-white absolute top-1 translate-x-7" />
                                 </div>
                             </div>
                         </div>
                     </section>

                     {/* ALERTS */}
                     <section id="notifications" className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-8">
                         <h2 className="font-heading font-bold text-xl uppercase tracking-widest text-white mb-6 flex items-center gap-2"><Bell className="w-5 h-5 text-[#22C55E]"/> Interruption Params</h2>
                         <div className="space-y-4">
                             <div className="flex items-center justify-between py-3 border-b border-[#2A2A2A]">
                                 <div>
                                     <h4 className="font-bold text-sm">Browser Push Notifications</h4>
                                     <p className="text-xs text-gray-500 font-mono">System level OS native alerts.</p>
                                 </div>
                                 <Button variant="secondary" className="border-gray-500 text-gray-300 hover:text-white h-8 text-xs font-bold">Request Access</Button>
                             </div>
                             <div className="flex items-center justify-between py-3 border-b border-[#2A2A2A]">
                                 <div>
                                     <h4 className="font-bold text-sm">Morning Email Brief</h4>
                                     <p className="text-xs text-gray-500 font-mono">Daily summary of required objectives at 08:00 AM.</p>
                                 </div>
                                 <div className="w-12 h-6 rounded-full bg-[#2A2A2A] relative"><div className="w-4 h-4 rounded-full bg-white absolute top-1 translate-x-1" /></div>
                             </div>
                             <div className="flex items-center justify-between py-3">
                                 <div>
                                     <h4 className="font-bold text-sm">Streak Danger Reports</h4>
                                     <p className="text-xs text-gray-500 font-mono">Critical late-night alarms preserving multipliers.</p>
                                 </div>
                                 <div className="w-12 h-6 rounded-full bg-[#22C55E] relative"><div className="w-4 h-4 rounded-full bg-white absolute top-1 translate-x-7" /></div>
                             </div>
                         </div>
                     </section>

                     {/* DANGER ZONE */}
                     <section id="data" className="bg-[#141414] border border-red-500/30 rounded-3xl p-8 relative overflow-hidden">
                         <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
                         <h2 className="font-heading font-bold text-xl uppercase tracking-widest text-white mb-6 flex items-center gap-2"><Shield className="w-5 h-5 text-red-500"/> Danger Zone</h2>
                         
                         <div className="flex flex-col gap-4 relative z-10">
                              <Button variant="ghost" onClick={handleLogout} className="border-gray-600 border text-gray-300 hover:text-white hover:bg-[#1A1A1A] h-12 justify-start font-bold">
                                  <LogOut className="w-5 h-5 mr-3" /> Terminate Session (Log Out)
                              </Button>
                              <Button variant="ghost" className="border-gray-600 border text-gray-300 hover:text-white hover:bg-[#1A1A1A] h-12 justify-start font-bold">
                                  <HardDrive className="w-5 h-5 mr-3 text-brand-yellow" /> Export JSON Archive
                              </Button>
                              <Button variant="danger" className="border-red-900 border bg-red-950/30 text-red-500 hover:bg-red-500 hover:text-black h-12 justify-start font-bold transition-colors">
                                  <Trash2 className="w-5 h-5 mr-3" /> Execute Account Deletion 
                              </Button>
                         </div>
                     </section>
                </div>
            </div>
        </div>
    );
}
