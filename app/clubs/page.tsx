'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { Users, ChevronRight, Search, Code, Palette, Music, Trophy, Globe, Zap, Cpu, Activity } from 'lucide-react';
import { getClubLogo } from '@/lib/club-assets';

export default function ClubsPage() {
    const [clubs, setClubs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
        try {
            const response = await api.get('/clubs');
            setClubs(response.data.clubs || []);
        } catch (error) {
            console.error('Error fetching clubs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredClubs = clubs.filter(club =>
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getClubTheme = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('tech') || n.includes('code') || n.includes('cyber')) return { color: 'cyan', icon: <Cpu />, gradient: 'from-cyan-500 to-blue-600', bg: 'tech-pattern' };
        if (n.includes('art') || n.includes('design') || n.includes('drama')) return { color: 'pink', icon: <Palette />, gradient: 'from-pink-500 to-rose-600', bg: 'art-pattern' };
        if (n.includes('music') || n.includes('dance')) return { color: 'purple', icon: <Music />, gradient: 'from-violet-500 to-purple-600', bg: 'music-pattern' };
        if (n.includes('sport') || n.includes('game')) return { color: 'orange', icon: <Trophy />, gradient: 'from-orange-500 to-red-600', bg: 'sport-pattern' };
        return { color: 'emerald', icon: <Users />, gradient: 'from-emerald-500 to-teal-600', bg: 'default-pattern' };
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500 selection:text-black overflow-x-hidden">
            <div className="fixed inset-0 z-0 bg-[url('/noise.png')] opacity-5 pointer-events-none"></div>
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/20 via-slate-900/0 to-transparent z-0 pointer-events-none"></div>

            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                {/* Hero Header */}
                <div className="text-center mb-20 animate-fade-in-up">
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-slate-700 bg-slate-900/50 backdrop-blur-md text-sm font-medium text-slate-300">
                        Explore Communities
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500">
                        Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Clubs</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed">
                        Join diverse communities, discover your passions, and attend exclusive events.
                        Find your tribe at JKLU.
                    </p>

                    {/* Search Bar */}
                    <div className="mt-10 max-w-xl mx-auto relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <div className="relative flex items-center bg-slate-900/80 border border-slate-700/50 rounded-2xl p-2 backdrop-blur-xl shadow-2xl transition-all duration-300 group-hover:border-slate-600">
                            <Search className="ml-4 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search for clubs..."
                                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 px-4 py-3 text-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-slate-800 border-t-cyan-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredClubs.map((club, index) => {
                            // Data overrides for specific clubs (fixing backend typos/slugs)
                            let displayClub = { ...club };
                            if (club.slug === 'astro-club') {
                                displayClub.name = 'Astronomy Club';
                                displayClub.slug = 'astronomy-club';
                            }
                            if (club.slug === 'media-club') {
                                displayClub.name = 'Media Club'; // Ensure consistency if backend differs
                            }
                            if (club.slug === 'business-club') {
                                displayClub.name = 'Corpova';
                            }

                            const theme = getClubTheme(displayClub.name);
                            return (
                                <Link
                                    href={`/clubs/${displayClub.slug}`}
                                    key={club.id}
                                    className="group relative h-[420px] bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-600 transition-all duration-500 hover:shadow-[0_0_30px_rgba(2,6,23,0.8)] flex flex-col"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* SVG Aesthetic Background */}
                                    <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                                        <div className={`absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br ${theme.gradient} blur-[100px] rounded-full`}></div>
                                        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <pattern id={`grid-${index}`} width="40" height="40" patternUnits="userSpaceOnUse">
                                                    <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="1" fill="none" className="text-white/5" />
                                                </pattern>
                                            </defs>
                                            <rect width="100%" height="100%" fill={`url(#grid-${index})`} />
                                        </svg>
                                    </div>

                                    {/* Icon / Logo Section */}
                                    <div className="relative p-8 pb-0 pt-10">
                                        {getClubLogo(displayClub.slug) ? (
                                            <div className="w-20 h-20 relative mb-6 group-hover:scale-110 transition-transform duration-500">
                                                <Image
                                                    src={getClubLogo(displayClub.slug)!}
                                                    alt={`${displayClub.name} logo`}
                                                    fill
                                                    className="object-contain drop-shadow-lg"
                                                />
                                            </div>
                                        ) : (
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                                {theme.icon}
                                            </div>
                                        )}

                                        {displayClub.council_name && (
                                            <div className="absolute top-8 right-8 px-3 py-1 rounded-full bg-slate-950/50 border border-slate-700/50 text-xs font-bold tracking-wider text-slate-400 uppercase backdrop-blur-md">
                                                {displayClub.council_name}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Section */}
                                    <div className="relative p-8 flex-1 flex flex-col">
                                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
                                            {displayClub.name}
                                        </h3>
                                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                                            {displayClub.description || 'A community for like-minded individuals to innovate, create, and grow together.'}
                                        </p>

                                        <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">
                                                View Club
                                            </span>
                                            <div className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white bg-white/5 group-hover:bg-gradient-to-r ${theme.gradient} group-hover:border-transparent transition-all duration-300 transform group-hover:rotate-[-45deg]`}>
                                                <ChevronRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Stripe */}
                                    <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${theme.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredClubs.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-slate-900 border border-slate-800 mb-6">
                            <Search className="w-8 h-8 text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No clubs found</h3>
                        <p className="text-slate-500">Try adjusting your search terms</p>
                    </div>
                )}
            </div>
        </div>
    );
}
