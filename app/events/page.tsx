'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { format } from 'date-fns';
import { Calendar, MapPin, Clock, Search, Filter, ChevronRight, Grid, List } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export default function EventsPage() {
    const router = useRouter();
    const { theme } = useTheme();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('upcoming'); // upcoming, past, all

    useEffect(() => {
        fetchEvents();
    }, [filter]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            let url = '/events?status=approved';
            if (filter === 'upcoming') {
                url += '&upcoming=true';
            }
            const response = await api.get(url);
            setEvents(response.data.events || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description?.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'past') {
            return matchesSearch && new Date(event.start_date) < new Date();
        }
        return matchesSearch;
    });

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] transition-colors duration-300 relative overflow-hidden">
            <Navbar />

            {/* Ambient Background Gradient */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-30 ${theme === 'dark' ? 'bg-blue-900/40' : 'bg-blue-200/60'}`} />
                <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-30 ${theme === 'dark' ? 'bg-[var(--primary)]/20' : 'bg-orange-200/60'}`} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
                >
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-blue-600">
                                Campus Events
                            </span>
                        </h1>
                        <p className={`text-lg max-w-2xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Discover screenings, workshops, competitions, and more happening at JKLU.
                        </p>
                    </div>

                    {/* Controls Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative group">
                            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${theme === 'dark' ? 'text-gray-400 group-hover:text-[var(--primary)]' : 'text-gray-400 group-hover:text-blue-500'}`} />
                            <input
                                type="text"
                                placeholder="Search events..."
                                className={`w-full sm:w-72 pl-12 pr-4 py-3 rounded-2xl border-2 transition-all duration-300 outline-none backdrop-blur-xl ${theme === 'dark'
                                    ? 'bg-white/5 border-white/10 focus:border-[var(--primary)] text-white placeholder-gray-500'
                                    : 'bg-white/50 border-gray-200 focus:border-blue-500 text-gray-900'
                                    }`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className={`flex items-center p-1 rounded-2xl border backdrop-blur-xl ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/50 border-gray-200'
                            }`}>
                            {['upcoming', 'all', 'past'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 capitalize ${filter === f
                                        ? 'bg-gradient-to-r from-[var(--primary)] to-orange-600 text-white shadow-lg shadow-orange-500/20'
                                        : `text-gray-500 hover:text-[var(--primary)]`
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="relative w-20 h-20">
                            <div className="absolute inset-0 border-4 border-t-[var(--primary)] border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
                            <div className="absolute inset-2 border-4 border-t-transparent border-r-blue-500 border-b-transparent border-l-[var(--primary)] rounded-full animate-spin reverse-spin"></div>
                        </div>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence>
                            {filteredEvents.map((event) => (
                                <motion.div
                                    key={event.id}
                                    variants={itemVariants}
                                    layout
                                    onClick={() => router.push(`/events/${event.id}`)}
                                    className={`group relative rounded-3xl overflow-hidden cursor-pointer border backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${theme === 'dark'
                                        ? 'bg-white/5 border-white/10 hover:border-[var(--primary)]/50 hover:shadow-[var(--primary)]/10'
                                        : 'bg-white/70 border-white hover:border-blue-200 hover:shadow-blue-500/10'
                                        }`}
                                >
                                    {/* Card Header Gradient */}
                                    <div className={`h-32 w-full relative overflow-hidden ${theme === 'dark'
                                        ? 'bg-gradient-to-br from-gray-800 to-gray-900 group-hover:from-[var(--primary)]/20 group-hover:to-blue-900/20'
                                        : 'bg-gradient-to-br from-gray-100 to-blue-50 group-hover:from-orange-50 group-hover:to-blue-50'
                                        } transition-colors duration-500`}>
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            {event.council_name && (
                                                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-black/20 text-white backdrop-blur-md rounded-full border border-white/10">
                                                    {event.council_name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="absolute bottom-4 left-4 right-4 relative z-10">
                                            <div className="flex items-center gap-2 text-xs font-medium opacity-80 mb-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {format(new Date(event.start_date), 'MMM d, yyyy')}
                                            </div>
                                            <h3 className={`text-xl font-bold line-clamp-2 leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {event.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6 pt-4">
                                        <div className="space-y-4 mb-6">
                                            <div className="flex items-center gap-3 text-sm font-medium">
                                                <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-blue-50'}`}>
                                                    <Clock className={`w-4 h-4 ${theme === 'dark' ? 'text-[var(--primary)]' : 'text-blue-600'}`} />
                                                </div>
                                                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                                    {format(new Date(event.start_date), 'h:mm a')}
                                                </span>
                                            </div>

                                            {event.venue && (
                                                <div className="flex items-center gap-3 text-sm font-medium">
                                                    <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-blue-50'}`}>
                                                        <MapPin className={`w-4 h-4 ${theme === 'dark' ? 'text-[var(--primary)]' : 'text-blue-600'}`} />
                                                    </div>
                                                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                                        {event.venue}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <p className={`text-sm line-clamp-3 mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {event.description}
                                        </p>

                                        {/* Action Area */}
                                        <div className={`pt-4 border-t flex items-center justify-between ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
                                            <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {event.club_name || 'JKLU Event'}
                                            </span>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${theme === 'dark'
                                                ? 'bg-white/10 text-white group-hover:bg-[var(--primary)]'
                                                : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                                                }`}>
                                                <ChevronRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {!loading && filteredEvents.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24"
                    >
                        <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                            <Calendar className={`w-10 h-10 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                        </div>
                        <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>No events found</h3>
                        <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>Try adjusting your search or filters to find what you're looking for.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
