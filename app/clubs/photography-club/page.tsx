'use client';

import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Camera, Aperture, Image as ImageIcon, Users, Eye, Layers, Calendar, MapPin, ChevronRight, Instagram, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function PhotographyClubPage() {
    const { user } = useAuth();
    const { setMode } = useTheme();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [joined, setJoined] = useState(false);
    const { scrollY } = useScroll();

    // Parallax effect for hero
    const y1 = useTransform(scrollY, [0, 500], [0, 100]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    useEffect(() => {
        setMounted(true);
        setMode('dark');
    }, []);

    const handleJoin = () => {
        if (!user) {
            router.push('/login');
            return;
        }
        setJoined(true);
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-teal-500 selection:text-black overflow-x-hidden relative">
            {/* Background Texture - Film Grain */}
            <div className="fixed inset-0 z-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("/noise.png")' }}></div>

            {/* Animated Aperture Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] border border-neutral-800/30 rounded-full opacity-20"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] border border-neutral-800/30 rounded-full opacity-20"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] border border-teal-900/10 rounded-full opacity-20"></div>

                {/* Glowing Orb */}
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-900/20 rounded-full blur-[120px]"></div>
            </div>

            <Navbar />

            {/* --- HERO SECTION: THE SHOT --- */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-20 px-4 text-center">

                <motion.div
                    style={{ y: y1, opacity }}
                    className="flex flex-col items-center"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, rotate: -20 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="mb-8 relative"
                    >
                        <div className="absolute inset-0 bg-teal-500/20 blur-[50px] rounded-full"></div>
                        <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border border-neutral-700 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm overflow-hidden">
                            <Image
                                src="/logos/Matrix (With BG).png"
                                alt="Photography Club Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <span className="text-teal-500 font-mono text-xs md:text-sm tracking-[0.3em] uppercase mb-4 block">JKLU Photography Club</span>
                        <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-4 text-white mix-blend-overlay">
                            THE SHADE
                        </h1>
                        <p className="text-xl md:text-2xl font-light text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                            More than pictures—<span className="text-teal-400 font-medium">visual storytelling.</span>
                        </p>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="absolute bottom-12 flex flex-col items-center gap-4"
                >
                    <button
                        onClick={handleJoin}
                        className={`px-8 py-3 rounded-full border ${joined ? 'bg-teal-500 border-teal-500 text-black' : 'border-neutral-600 hover:border-teal-500 hover:text-teal-400'} transition-all duration-300 uppercase tracking-widest text-xs font-bold`}
                    >
                        {joined ? 'Focus Locked' : 'Capture Your Spot'}
                    </button>
                    <div className="h-12 w-[1px] bg-gradient-to-b from-neutral-700 to-transparent"></div>
                </motion.div>
            </div>

            {/* --- FOCUS: MISSION & VISION --- */}
            <section className="relative z-10 py-24 bg-neutral-900/30 border-y border-neutral-800 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <SectionTitle number="01" title="The Perspective" />
                        <p className="text-lg text-neutral-400 leading-relaxed mb-8">
                            The Shade is JKLU’s photography club, focused on exploring visual storytelling through the lens. We bring together students who share a passion for capturing moments, experimenting with perspectives, and expressing ideas through images.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <StatBlock icon={<Camera />} label="Photo Walks" value="Monthly" />
                            <StatBlock icon={<Layers />} label="Exhibitions" value="Annual" />
                            <StatBlock icon={<Eye />} label="Workshops" value="Expert-Led" />
                            <StatBlock icon={<Users />} label="Community" value="Growing" />
                        </div>
                    </div>
                    <div className="relative h-full min-h-[400px] border border-neutral-800 bg-neutral-950 p-2">
                        {/* Placeholder for Gallery Grid */}
                        <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
                            <div className="bg-neutral-800 rounded-sm relative overflow-hidden group">
                                <div className="absolute inset-0 bg-teal-900/20 group-hover:bg-transparent transition-colors"></div>
                                <div className="absolute bottom-2 left-2 text-[10px] bg-black/50 px-2 py-1 text-white backdrop-blur-md">PORTRAIT</div>
                            </div>
                            <div className="bg-neutral-800 rounded-sm relative overflow-hidden group">
                                <div className="absolute inset-0 bg-teal-900/20 group-hover:bg-transparent transition-colors"></div>
                                <div className="absolute bottom-2 left-2 text-[10px] bg-black/50 px-2 py-1 text-white backdrop-blur-md">STREET</div>
                            </div>
                            <div className="bg-neutral-800 rounded-sm relative overflow-hidden group col-span-2">
                                <div className="absolute inset-0 bg-teal-900/20 group-hover:bg-transparent transition-colors"></div>
                                <div className="absolute bottom-2 left-2 text-[10px] bg-black/50 px-2 py-1 text-white backdrop-blur-md">LANDSCAPE</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- EXPOSURE: EVENTS --- */}
            <section className="relative z-10 py-24 max-w-5xl mx-auto px-4">
                <div className="text-center mb-16">
                    <SectionTitle number="02" title="Exposure Timeline" center />
                </div>

                <div className="relative border-l border-neutral-800 ml-4 md:ml-0 space-y-12">
                    <EventItem
                        date="23 JAN 2026"
                        title="Orientation & Portfolio Review"
                        desc="An introductory session covering the club’s vision, activities, basics of photography, and a meet-and-greet."
                        status="Completed"
                    />
                    <EventItem
                        date="13 FEB 2026"
                        title="Interactive Peer Review"
                        desc="Critique-based session where members present their work and receive feedback to improve visual storytelling."
                        status="Upcoming"
                        highlight
                    />
                    <EventItem
                        date="27 FEB 2026"
                        title="Photo Walk: Heritage Jaipur"
                        desc="Guided photo walk through heritage sites and local streets, followed by a review session."
                        status="Upcoming"
                    />
                    <EventItem
                        date="20 MAR 2026"
                        title="Pro Photography Workshop"
                        desc="Theme-based hands-on workshop on composition, lighting, and storytelling with a professional."
                        status="Planned"
                    />
                    <EventItem
                        date="17 APR 2026"
                        title="Annual Exhibition"
                        desc="Curated showcase of student work, open to the campus community."
                        status="Planned"
                    />
                </div>
            </section>

            {/* --- THE LENS: LEADERSHIP --- */}
            <section className="relative z-10 py-24 bg-neutral-900 border-t border-neutral-800">
                <div className="max-w-7xl mx-auto px-4">
                    <SectionTitle number="03" title="The Lens" subtitle="Club Leadership" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                        <LeaderCard
                            role="Chair"
                            name="Roshan Jangir"
                            email="roshan.jangir@jklu.edu.in"
                            image="/Photoes ID CARD Student Council/roshanjangir.jpg"
                        />
                        <LeaderCard
                            role="Co-Chair"
                            name="Meenakshi Vydianathan"
                            email="meenakshi.v@jklu.edu.in"
                            image="/Photoes ID CARD Student Council/Meenakshi Vydianathan .HEIC"
                        />
                    </div>
                </div>
            </section>

            {/* Footer decoration */}
            <div className="h-24 bg-teal-950/10 border-t border-neutral-800 flex items-center justify-center gap-8">
                <SocialLink href="mailto:photographyclub@jklu.edu.in" icon={<Mail />} label="Email Us" />
                <SocialLink href="https://www.instagram.com/the.shade.jklu?igsh=bDVpNnRpOGx5dHVi" icon={<Instagram />} label="Instagram" />
            </div>
        </div>
    );
}

// --- SUBCOMPONENTS ---

function SectionTitle({ number, title, subtitle, center }: any) {
    return (
        <div className={`mb-8 ${center ? 'flex flex-col items-center' : ''}`}>
            <div className="flex items-baseline gap-4 mb-2">
                <span className="text-teal-500 font-mono text-sm font-bold">0{number}</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight">{title}</h2>
            </div>
            {subtitle && <p className="text-neutral-500 uppercase tracking-widest text-xs ml-10">{subtitle}</p>}
        </div>
    );
}

function StatBlock({ icon, label, value }: any) {
    return (
        <div className="p-4 bg-neutral-900 border border-neutral-800/50 rounded-lg flex items-center gap-4">
            <div className="p-3 bg-teal-500/10 text-teal-500 rounded-full">{icon}</div>
            <div>
                <div className="text-white font-bold">{value}</div>
                <div className="text-neutral-500 text-xs uppercase tracking-wide">{label}</div>
            </div>
        </div>
    );
}

function EventItem({ date, title, desc, status, highlight }: any) {
    return (
        <div className="relative pl-8 md:pl-12 group">
            {/* Dot on timeline */}
            <div className={`absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full border-2 ${highlight ? 'bg-teal-500 border-teal-500' : 'bg-neutral-900 border-neutral-600'} group-hover:border-teal-400 transition-colors z-10`}></div>

            <div className={`p-6 rounded-lg border ${highlight ? 'bg-teal-900/10 border-teal-500/30' : 'bg-neutral-900/50 border-neutral-800'} hover:border-teal-500/50 transition-all duration-300`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                    <span className="text-teal-500 font-mono text-xs font-bold tracking-widest">{date}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${status === 'Completed' ? 'bg-neutral-800 text-neutral-500' : 'bg-teal-500/20 text-teal-400'}`}>
                        {status}
                    </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-200 transition-colors">{title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function LeaderCard({ role, name, email, image }: any) {
    return (
        <div className="flex items-center gap-6 p-6 border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 transition-colors group">
            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center group-hover:border-teal-500 transition-colors overflow-hidden">
                {image ? (
                    <img src={image} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <Users className="text-neutral-500 group-hover:text-teal-500 transition-colors" />
                )}
            </div>
            <div>
                <span className="text-teal-500 text-xs font-bold uppercase tracking-widest block mb-1">{role}</span>
                <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
                <a href={`mailto:${email}`} className="text-neutral-500 text-sm hover:text-teal-400 transition-colors flex items-center gap-2">
                    <Mail className="w-3 h-3" /> {email}
                </a>
            </div>
        </div>
    );
}

function SocialLink({ href, icon, label }: any) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-neutral-400 hover:text-teal-400 transition-colors text-sm font-bold uppercase tracking-widest"
        >
            {icon}
            {label}
        </a>
    );
}
