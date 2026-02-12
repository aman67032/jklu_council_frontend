'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Calendar, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import api from '@/lib/api';

interface ClubEventCardProps {
    id: string;
    title: string;
    icon?: React.ReactNode;
    color?: string; // e.g., "text-orange-400"
    bg?: string;    // e.g., "bg-orange-400/5"
    border?: string;// e.g., "group-hover:border-orange-500/50"
    desc?: string;
    date: string;
    imageUrl?: string;
    venue?: string;
    status: string;
    is_enrolled?: boolean;
    onEnroll?: () => void; // Optional callback after enrollment
}

export default function ClubEventCard({ id, title, icon, color = "text-blue-400", bg = "bg-blue-400/5", border = "group-hover:border-blue-500/50", desc, date, imageUrl, venue, status, is_enrolled, onEnroll }: ClubEventCardProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { theme } = useTheme();
    const [enrolling, setEnrolling] = useState(false);
    const [localEnrolled, setLocalEnrolled] = useState(is_enrolled);

    const handleEnroll = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click navigation

        if (!user) {
            router.push(`/login?redirect=/events/${id}`);
            return;
        }

        if (user.role !== 'student') {
            alert('Only students can enroll in events');
            return;
        }

        setEnrolling(true);
        try {
            await api.post(`/events/${id}/enroll`);
            setLocalEnrolled(true);
            if (onEnroll) onEnroll();
            alert('Successfully enrolled!');
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to enroll');
        } finally {
            setEnrolling(false);
        }
    };

    const isPast = new Date(date) < new Date();
    const canEnroll = user?.role === 'student' && !localEnrolled && !isPast && status === 'approved';

    return (
        <div
            onClick={() => router.push(`/events/${id}`)}
            className={`cursor-pointer group p-6 rounded-3xl bg-gray-900/40 border border-gray-800 ${border} transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden backdrop-blur-sm flex flex-col h-full`}
        >
            <div className={`absolute -right-10 -top-10 w-40 h-40 ${bg} opacity-50 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700`}></div>

            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-black border border-gray-800 shadow-lg ${color}`}>
                    {icon || <Calendar className="w-6 h-6" />}
                </div>
                {date && (
                    <div className="text-xs font-mono text-slate-500 bg-black/50 px-3 py-1 rounded-full border border-gray-800">
                        {format(new Date(date), 'MMM d, yyyy')}
                    </div>
                )}
            </div>

            {imageUrl && (
                <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden shadow-lg border border-white/5">
                    <Image src={imageUrl} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
            )}

            <h3 className="text-xl font-bold mb-2 text-slate-100 group-hover:text-white transition-colors line-clamp-2">{title}</h3>

            <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">{desc || "Join us for an exciting event!"}</p>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto gap-4">
                {venue && (
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {venue}
                    </span>
                )}

                {/* Enrollment / Status Button */}
                <div className="flex items-center gap-2 ml-auto">
                    {localEnrolled ? (
                        <span className="text-green-500 flex items-center gap-1 text-sm font-bold bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                            <CheckCircle className="w-4 h-4" /> Enrolled
                        </span>
                    ) : canEnroll ? (
                        <button
                            onClick={handleEnroll}
                            disabled={enrolling}
                            className={`px-4 py-1.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/20 transition-all ${enrolling ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {enrolling ? '...' : 'Enroll'}
                        </button>
                    ) : (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-1 border border-white/10 ${color}`}>
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
