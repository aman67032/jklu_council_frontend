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
        if (n.includes('tech') || n.includes('code') || n.includes('cyber')) return { color: 'blue', icon: <Cpu />, gradient: 'from-blue-600 to-indigo-600', bg: 'tech-pattern' };
        if (n.includes('art') || n.includes('design') || n.includes('drama')) return { color: 'orange', icon: <Palette />, gradient: 'from-orange-500 to-red-600', bg: 'art-pattern' };
        if (n.includes('music') || n.includes('dance')) return { color: 'amber', icon: <Music />, gradient: 'from-amber-500 to-orange-600', bg: 'music-pattern' };
        if (n.includes('sport') || n.includes('game')) return { color: 'red', icon: <Trophy />, gradient: 'from-red-600 to-orange-700', bg: 'sport-pattern' };
        return { color: 'blue', icon: <Users />, gradient: 'from-blue-500 to-cyan-500', bg: 'default-pattern' };
    };

    const displayedSlugs = new Set();
    const uniqueFilteredClubs = filteredClubs.reduce((acc: any[], club) => {
        let displayClub = { ...club };

        // Normalize slugs
        if (club.slug === 'astro-club') {
            displayClub.name = 'Astronomy Club';
            displayClub.slug = 'astronomy-club';
        }
        if (club.slug === 'media-club') {
            displayClub.name = 'Media Club';
        }
        if (club.slug === 'business-club') {
            displayClub.name = 'Corpova';
        }

        // Deduplicate based on normalized slug
        if (!displayedSlugs.has(displayClub.slug)) {
            displayedSlugs.add(displayClub.slug);
            acc.push(displayClub);
        }

        return acc;
    }, []);

    return (
        <div className="min-h-screen bg-[#050510] text-gray-100 selection:bg-orange-500/30 selection:text-white overflow-x-hidden">
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[100px]" />
            </div>

            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                {/* Hero Header */}
                <div className="text-center mb-20 animate-fade-in-up">
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-gray-800 bg-gray-900/50 backdrop-blur-md text-sm font-medium text-gray-400">
                        Explore Communities
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white">
                        Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-orange-500">Clubs</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed">
                        Join diverse communities, discover your passions, and attend exclusive events.
                        Find your tribe at JKLU.
                    </p>

                    {/* Search Bar */}
                    <div className="mt-10 max-w-xl mx-auto relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <div className="relative flex items-center bg-gray-900/80 border border-gray-800 rounded-2xl p-2 backdrop-blur-xl shadow-2xl transition-all duration-300 group-hover:border-gray-700 focus-within:border-blue-500/50">
                            <Search className="ml-4 w-5 h-5 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search for clubs..."
                                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-600 px-4 py-3 text-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-gray-800 border-t-orange-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {uniqueFilteredClubs.map((displayClub: any, index: number) => {
                            const theme = getClubTheme(displayClub.name);
                            return (
                                <Link
                                    href={`/clubs/${displayClub.slug}`}
                                    key={displayClub.slug + index}
                                    className="group relative h-[420px] bg-gray-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-orange-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 flex flex-col"
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
                                            <div className="absolute top-8 right-8 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs font-bold tracking-wider text-gray-400 uppercase backdrop-blur-md">
                                                {displayClub.council_name}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Section */}
                                    <div className="relative p-8 flex-1 flex flex-col">
                                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                                            {displayClub.name}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                                            {displayClub.description || 'A community for like-minded individuals to innovate, create, and grow together.'}
                                        </p>

                                        <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">
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
                        <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-gray-900 border border-gray-800 mb-6">
                            <Search className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No clubs found</h3>
                        <p className="text-gray-500">Try adjusting your search terms</p>
                    </div>
                )}
            </div>
        </div>
    );
}
