'use client';

import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { User, Award, Newspaper, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Coordinator Data
const COORDINATORS = [
    {
        id: 1,
        name: "Pulkit Dosi",
        role: "Academic Coordinator",
        studentId: "2024BBA067",
        description: "Ensures smooth academic operations, addressing student concerns regarding curriculum and scheduling, and acting as a bridge between faculty and students."
    },
    {
        id: 2,
        name: "Adarsh Singh",
        role: "Placement Coordinator",
        studentId: "2024BTECH067",
        description: "Facilitates campus recruitment drives, coordinates with the placement cell, and organizes career development workshops for student success."
    },
    {
        id: 3,
        name: "Tanik Gupta",
        role: "Transport Coordinator",
        studentId: "2024BTECH234",
        description: "Manages university transport logistics, ensuring timely shuttle services and addressing all student commuting requirements."
    },
    {
        id: 4,
        name: "Kartavya Garhwal",
        role: "Mess Coordinator",
        studentId: "2024BTECH079",
        description: "Supervises mess operations to maintain food quality and hygiene, while gathering and implementing student feedback on the menu."
    },
    {
        id: 5,
        name: "Aryan Chaturvedi",
        role: "Boys Hostel Coordinator",
        studentId: "2024BTECH265",
        description: "Oversees the welfare of male residents, resolving accommodation issues and ensuring a safe, disciplined hostel environment."
    },
    {
        id: 6,
        name: "Astha Barnwal",
        role: "Girls Hostel Coordinator",
        studentId: "2024BDES007",
        description: "Ensures a secure and comfortable living environment for female students, addressing maintenance requests and fostering hostel community life."
    },
    {
        id: 7,
        name: "Himani Bohra",
        role: "Website Coordinator",
        studentId: "2024BTECH134",
        description: "Maintains and updates the council's digital presence, ensuring accurate information dissemination through the official website."
    },
    {
        id: 8,
        name: "Vaibhav Khandelwal",
        role: "Campus Ambassador",
        studentId: "2024BTECH110",
        description: "Represents the university in external forums, fosters inter-institutional relations, and champions the campus culture to the outside world."
    },
    {
        id: 9,
        name: "Charvi Sharma",
        role: "Alumni Relations Coordinator",
        studentId: "2025BBA029",
        description: "Strengthens the bond between alumni and current students through networking events, mentorship programs, and regular engagement."
    },
    {
        id: 10,
        name: "Kaushal Malvi",
        role: "Social Media Coordinator",
        studentId: "2025BTECH263",
        description: "Manages the council's social media handles, creating engaging content to cover events and keep the student body connected and informed."
    },
];

export default function CoordinatorsPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#F0F0F0] text-slate-900 font-serif selection:bg-slate-300 overflow-x-hidden relative">
            <Navbar />

            {/* --- NEWSPAPER HEADER --- */}
            <div className="pt-28 pb-12 px-4 max-w-7xl mx-auto text-center border-b-4 border-double border-slate-800 mb-12">
                <div className="flex items-center justify-between mb-2 text-xs uppercase tracking-widest text-slate-500 font-sans border-b border-slate-300 pb-2">
                    <span>Vol. 1, Issue 1</span>
                    <span>The JKLU Council Gazette</span>
                    <span>{new Date().toLocaleDateString()}</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                    The Coordinators
                </h1>
                <p className="text-xl md:text-2xl italic text-slate-700 max-w-3xl mx-auto">
                    "Meet the dedicated team driving excellence across campus logistics, academics, and student life."
                </p>
            </div>

            {/* --- GRID LAYOUT --- */}
            <div className="max-w-7xl mx-auto px-4 pb-24">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {COORDINATORS.map((coord, index) => (
                        <div key={coord.id} className="break-inside-avoid">
                            <NewspaperCard coordinator={coord} index={index} />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- FOOTER --- */}
            <footer className="bg-slate-900 text-slate-400 py-12 text-center font-sans">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Newspaper className="w-5 h-5" />
                    <span className="font-bold tracking-widest uppercase text-white">Council Press</span>
                </div>
                <p className="text-sm">Based on official Student Council records.</p>
            </footer>
        </div>
    );
}

function NewspaperCard({ coordinator, index }: { coordinator: any, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-[#FFFCF5] p-4 shadow-xl border border-slate-300 relative group hover:-translate-y-1 transition-transform duration-300"
        >
            {/* Paper Texture Overlay */}
            <div className="absolute inset-0 bg-slate-500/5 pointer-events-none mix-blend-multiply"></div>

            {/* Photo Placeholder */}
            <div className="relative aspect-[4/5] bg-slate-200 mb-4 border-2 border-slate-800 grayscale group-hover:grayscale-0 transition-all duration-500 overflow-hidden">
                {/* Fallback pattern or user icon if no image */}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-300">
                    <User className="w-24 h-24 text-slate-500 opacity-50" />
                </div>

                {/* Scanlines effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
            </div>

            {/* Content */}
            <div className="relative z-20 text-center font-serif">
                <h2 className="text-2xl font-bold text-slate-900 mb-1 border-b-2 border-slate-800 inline-block pb-1">
                    {coordinator.name}
                </h2>
                <div className="my-3">
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-600 font-sans mb-1">
                        {coordinator.role}
                    </p>
                    <p className="text-xs font-mono text-slate-500">
                        ID: {coordinator.studentId}
                    </p>
                </div>

                {/* Decorative Text */}
                <p className="text-[10px] text-justify text-slate-800 leading-tight opacity-90 mt-4 font-sans font-medium">
                    {coordinator.description}
                </p>
            </div>

            {/* Pin/Tape Effect */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8 bg-yellow-100/80 shadow-sm transform -rotate-2 border border-yellow-200/50"></div>
        </motion.div>
    );
}

