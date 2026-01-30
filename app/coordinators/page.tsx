'use client';

import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Search, Filter, Mail, Linkedin, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Types for our coordinators
interface Coordinator {
    id: string;
    name: string;
    role: string;
    councilOrClub: string; // e.g., "Council of Technical Affairs" or "Art Club"
    category: 'council' | 'club';
    image?: string;
    email?: string;
    linkedin?: string;
}

// Mock Data - In a real app, this would come from an API endpoint like /api/coordinators
const MOCK_COORDINATORS: Coordinator[] = [
    // Council Leaders
    {
        id: 'c1',
        name: 'Yash Mishra',
        role: 'General Secretary',
        councilOrClub: 'Student Council',
        category: 'council',
        image: '/Clubs/tech_club/club_chair.png', // Using existing assets as placeholders if needed
        email: 'gs@jklu.edu.in'
    },
    {
        id: 'c2',
        name: 'Rashi Katiyar',
        role: 'Technical Secretary',
        councilOrClub: 'Council of Technical Affairs',
        category: 'council',
        image: '/Clubs/tech_club/Club_Co_Chair .jpg'
    },
    {
        id: 'c3',
        name: 'Jigeesha Agarawal',
        role: 'Cultural Secretary',
        councilOrClub: 'Cultural Council',
        category: 'council',
        image: '/Clubs/Art_club/Club_Chair.jpg'
    },
    // Art Club
    {
        id: 'a1',
        name: 'Jigeesha Agarawal',
        role: 'Chairperson',
        councilOrClub: 'Art Club',
        category: 'club',
        image: '/Clubs/Art_club/Club_Chair.jpg'
    },
    {
        id: 'a2',
        name: 'Mohit Suwalka',
        role: 'Co-Chairperson',
        councilOrClub: 'Art Club',
        category: 'club',
        image: '/Clubs/Art_club/Co-chair.jpg'
    },
    {
        id: 'a3',
        name: 'Saumya Agarwal',
        role: 'Creative Head',
        councilOrClub: 'Art Club',
        category: 'club',
        image: '/Clubs/Art_club/Creative Head.jpg'
    },
    // Tech Club
    {
        id: 't1',
        name: 'Tejendra Singh',
        role: 'Super Coordinator',
        councilOrClub: 'Technology Club',
        category: 'club',
        image: '/Clubs/tech_club/Club Super co-ordinator .jpg'
    }
];

export default function CoordinatorsPage() {
    const { theme } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'council' | 'club'>('all');
    const [coordinators, setCoordinators] = useState<Coordinator[]>(MOCK_COORDINATORS);

    const filteredCoordinators = coordinators.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.councilOrClub.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || c.category === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
            <Navbar />

            {/* Background Ambient Light */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 ${theme === 'dark' ? 'bg-purple-600' : 'bg-purple-300'}`}></div>
                <div className={`absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-300'}`}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black mb-6 tracking-tight"
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                            LEADERSHIP
                        </span> DIRECTORY
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className={`text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                        Meet the dedicated students driving innovation and culture at JKLU.
                    </motion.p>
                </div>

                {/* Filters & Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 sticky top-24 z-30 p-4 rounded-3xl backdrop-blur-xl border border-white/20 shadow-lg bg-white/5"
                >
                    <div className="relative w-full md:w-96">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                            type="text"
                            placeholder="Search by name, role, or club..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-12 pr-4 py-3 rounded-2xl border-none outline-none transition-all ${theme === 'dark'
                                    ? 'bg-white/10 text-white placeholder-gray-500 focus:bg-white/20'
                                    : 'bg-gray-100 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-100'
                                }`}
                        />
                    </div>

                    <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/10 border border-white/10">
                        {(['all', 'council', 'club'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${filter === f
                                        ? 'bg-white text-black shadow-lg'
                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    <AnimatePresence>
                        {filteredCoordinators.map((coordinator) => (
                            <CoordinatorCard key={coordinator.id} data={coordinator} theme={theme} />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredCoordinators.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-xl">No leaders found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function CoordinatorCard({ data, theme }: { data: Coordinator, theme: string }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`group relative rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${theme === 'dark'
                    ? 'bg-[#121212] border-white/10 hover:border-blue-500/50'
                    : 'bg-white border-gray-100 hover:border-blue-200'
                }`}
        >
            {/* Image Header */}
            <div className="h-64 relative overflow-hidden bg-gray-200">
                {data.image ? (
                    <Image
                        src={data.image}
                        alt={data.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <User className="w-20 h-20 text-gray-400" />
                    </div>
                )}
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'dark' ? 'from-[#121212]' : 'from-white'} to-transparent opacity-80`}></div>

                {/* Badge */}
                <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full backdrop-blur-md ${data.category === 'council'
                            ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                            : 'bg-pink-500/20 text-pink-500 border border-pink-500/30'
                        }`}>
                        {data.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 relative -mt-12 z-10">
                <h3 className={`text-xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {data.name}
                </h3>
                <p className={`text-sm font-medium mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {data.role}
                </p>

                <div className={`h-px w-full mb-4 ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'}`}></div>

                <p className={`text-xs font-bold uppercase tracking-wider mb-6 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                    {data.councilOrClub}
                </p>

                {/* Social Actions */}
                <div className="flex gap-2">
                    {data.email && (
                        <a href={`mailto:${data.email}`} className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 hover:bg-blue-600 hover:text-white text-gray-400' : 'bg-gray-100 hover:bg-blue-500 hover:text-white text-gray-600'
                            }`}>
                            <Mail className="w-4 h-4" />
                        </a>
                    )}
                    {data.linkedin && (
                        <a href={data.linkedin} target="_blank" rel="noreferrer" className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 hover:bg-blue-700 hover:text-white text-gray-400' : 'bg-gray-100 hover:bg-blue-700 hover:text-white text-gray-600'
                            }`}>
                            <Linkedin className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
