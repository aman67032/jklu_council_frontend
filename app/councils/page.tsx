'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { Award, ChevronRight, Users, Gavel, BookOpen, Heart, Activity, Globe, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCouncilLogo } from '@/lib/club-assets';

export default function CouncilsPage() {
    const [councils, setCouncils] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCouncils();
    }, []);

    const fetchCouncils = async () => {
        try {
            const response = await api.get('/councils');
            setCouncils(response.data.councils || []);
        } catch (error) {
            console.error('Error fetching councils:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCouncilIcon = (slug: string) => {
        if (slug.includes('technical')) return <Gavel className="w-8 h-8" />;
        if (slug.includes('cultural')) return <Heart className="w-8 h-8" />;
        if (slug.includes('academic')) return <BookOpen className="w-8 h-8" />;
        if (slug.includes('sports')) return <Activity className="w-8 h-8" />;
        if (slug.includes('campus')) return <Users className="w-8 h-8" />;
        if (slug.includes('public')) return <Megaphone className="w-8 h-8" />;
        return <Award className="w-8 h-8" />;
    };

    const getCouncilGradient = (index: number) => {
        const gradients = [
            'from-blue-500 to-indigo-600',
            'from-emerald-500 to-teal-600',
            'from-amber-500 to-orange-600',
            'from-rose-500 to-pink-600',
            'from-violet-500 to-purple-600',
            'from-cyan-500 to-blue-600',
        ];
        return gradients[index % gradients.length];
    };

    // Roster Data
    const councilRoster: Record<string, { genSec: string; sec: string }> = {
        'academic-affairs': { genSec: 'Kopal Jain', sec: 'Bhupathi Likhitha' },
        'cultural-affairs': { genSec: 'Divya Krishnani', sec: 'Rishika Singh' },
        'campus-life': { genSec: 'Aman Gupta', sec: 'Aditya Nayak' },
        'technical-affairs': { genSec: 'Suryaansh Sharma', sec: 'Aman Pratap Singh' },
        'sports-affairs': { genSec: 'Ishaan Saraswat', sec: 'Aman Prakash' },
        'public-relations': { genSec: 'Diya Garg', sec: 'Vaishnavi Shukla' },
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative font-sans selection:bg-amber-500 selection:text-white">
            <Navbar />

            {/* Background Effects */}
            <div className="fixed inset-0 z-0 bg-[url('/noise.png')] opacity-5 pointer-events-none"></div>
            <div className="fixed top-0 left-0 w-full h-[600px] bg-gradient-to-b from-slate-900 via-[#020617] to-[#020617] z-0 pointer-events-none"></div>
            <div className="fixed top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="fixed bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-[100px]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                {/* Hero Section */}
                <div className="text-center mb-24 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-bold tracking-widest uppercase text-amber-500 mb-6">
                            Est. 2011 • Student Council 2025-26
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-200 to-slate-500">
                            The Pillars of JKLU
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed mb-12">
                            The governing bodies that drive innovation, culture, and student life.
                            The heartbeat of our campus community.
                        </p>

                        {/* President Hero Card */}
                        <div className="max-w-md mx-auto relative group cursor-default">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-purple-600/20 blur-xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <div className="relative bg-slate-900/60 border border-amber-500/30 backdrop-blur-xl p-8 rounded-2xl flex flex-col items-center">
                                <div className="w-32 h-32 relative mb-4 group-hover:scale-105 transition-transform duration-500">
                                    <Image
                                        src="/logos/GreyPanel (With BG).png"
                                        alt="President Logo"
                                        fill
                                        className="object-contain drop-shadow-xl"
                                    />
                                </div>
                                <h2 className="text-2xl font-black text-white mb-1">Shubham Jain</h2>
                                <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-bold uppercase tracking-widest">
                                    President
                                </div>
                            </div>
                        </div>


                    </motion.div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-100"></div>
                            <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {councils.map((council, index) => {
                            const icon = getCouncilIcon(council.slug);
                            const gradient = getCouncilGradient(index);
                            const leaders = councilRoster[council.slug];

                            return (
                                <motion.div
                                    key={council.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Link
                                        href={`/councils/${council.slug}`}
                                        className="group relative block h-full bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                                    >
                                        {/* Hover Gradient Overlay */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                                        {/* Content */}
                                        <div className="p-8 h-full flex flex-col relative z-10">
                                            <div className="flex justify-between items-start mb-8">
                                                {getCouncilLogo(council.slug) ? (
                                                    <div className="w-20 h-20 relative group-hover:scale-110 transition-transform duration-500">
                                                        <Image
                                                            src={getCouncilLogo(council.slug)!}
                                                            alt={`${council.name} logo`}
                                                            fill
                                                            className="object-contain drop-shadow-lg"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} p-0.5 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                                        <div className="w-full h-full bg-[#0a1525] rounded-[14px] flex items-center justify-center text-white">
                                                            {icon}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-black group-hover:border-transparent transition-all duration-300">
                                                    <ChevronRight className="w-5 h-5" />
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-bold text-white mb-3 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
                                                {council.name}
                                            </h3>

                                            {/* Leadership Section */}
                                            {leaders && (
                                                <div className="mb-6 space-y-2">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                        <span className="text-slate-400">GS:</span>
                                                        <span className="font-bold text-white">{leaders.genSec}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                        <span className="text-slate-400">Sec:</span>
                                                        <span className="font-bold text-white">{leaders.sec}</span>
                                                    </div>
                                                </div>
                                            )}

                                            <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                                {council.description || 'Dedicated to excellence in student governance and activities.'}
                                            </p>

                                            <div className="mt-auto pt-6 border-t border-white/5 flex items-center gap-4">
                                                {council.club_count !== undefined && (
                                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                        <Activity className="w-4 h-4 text-emerald-500" />
                                                        {council.club_count} Active Clubs
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
