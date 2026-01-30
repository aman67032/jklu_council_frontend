'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { format } from 'date-fns';
import { Calendar, MapPin, Award, Users, Info, Image as ImageIcon, ChevronRight, Gavel, BookOpen, Heart, Activity, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Roster Data (Duplicated for availability in dynamic route)
const councilRoster: Record<string, { genSec: string; sec: string }> = {
  'academic-affairs': { genSec: 'Kopal Jain', sec: 'Bhupathi Likhitha' },
  'cultural-affairs': { genSec: 'Divya Krishnani', sec: 'Rishika Singh' },
  'campus-life': { genSec: 'Aman Gupta', sec: 'Aditya Nayak' },
  'technical-affairs': { genSec: 'Suryaansh Sharma', sec: 'Aman Pratap Singh' },
  'sports-affairs': { genSec: 'Ishaan Saraswat', sec: 'Aman Prakash' },
  'public-relations': { genSec: 'Diya Garg', sec: 'Vaishnavi Shukla' },
};

const getCouncilIcon = (slug: string) => {
  if (slug.includes('technical')) return <Gavel className="w-12 h-12" />;
  if (slug.includes('cultural')) return <Heart className="w-12 h-12" />;
  if (slug.includes('academic')) return <BookOpen className="w-12 h-12" />;
  if (slug.includes('sports')) return <Activity className="w-12 h-12" />;
  if (slug.includes('campus')) return <Users className="w-12 h-12" />;
  if (slug.includes('public')) return <Megaphone className="w-12 h-12" />;
  return <Award className="w-12 h-12" />;
};

export default function CouncilDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [council, setCouncil] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCouncil();
  }, [slug]);

  const fetchCouncil = async () => {
    try {
      const response = await api.get(`/councils/${slug}`);
      setCouncil(response.data.council);
    } catch (error) {
      console.error('Error fetching council:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    );
  }

  if (!council) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Council Not Found</h2>
          <Link href="/councils" className="text-amber-500 hover:text-amber-400 font-bold">Return to Councils</Link>
        </div>
      </div>
    );
  }

  const leaders = councilRoster[slug];
  const icon = getCouncilIcon(slug);

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-amber-500 selection:text-white pb-20 overflow-x-hidden">
      <Navbar />

      {/* Background Effects */}
      <div className="fixed inset-0 z-0 bg-[url('/noise.png')] opacity-5 pointer-events-none"></div>
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/20 via-[#020617] to-[#020617] z-0 pointer-events-none"></div>

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        <Link href="/councils" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-widest">
          <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Back to Councils
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-center gap-8 mb-16"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl rotate-3 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.2)] border-2 border-white/10 shrink-0">
            <div className="w-full h-full bg-[#0a1525] rounded-[14px] flex items-center justify-center text-white">
              {icon}
            </div>
          </div>
          <div className="text-center md:text-left">
            <div className="inline-block px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-bold tracking-widest uppercase text-amber-500 mb-4">
              Est. 2011 • Student Council
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">
              {council.name}
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl font-light">
              Driving excellence and innovation across campus.
            </p>
          </div>
        </motion.div>

        {/* New Leadership Section */}
        {leaders && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
          >
            <div className="relative bg-slate-900/40 border border-white/10 p-6 rounded-2xl flex items-center gap-6 overflow-hidden group">
              <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors"></div>
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 relative z-10 text-emerald-500 font-bold text-xl">
                {leaders.genSec.charAt(0)}
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-1">{leaders.genSec}</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">General Secretary</p>
                </div>
              </div>
            </div>

            <div className="relative bg-slate-900/40 border border-white/10 p-6 rounded-2xl flex items-center gap-6 overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 relative z-10 text-blue-500 font-bold text-xl">
                {leaders.sec.charAt(0)}
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-1">{leaders.sec}</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Secretary</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl p-8 border border-white/5">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Info className="text-amber-500" /> About the Council
              </h2>
              <p className="text-slate-400 leading-relaxed text-lg whitespace-pre-wrap">
                {council.description || "Leading the charge in student representation and activities, this council is dedicated to fostering a vibrant and inclusive campus environment through various initiatives and events."}
              </p>
            </div>

            {/* Associated Clubs */}
            {council.clubs && council.clubs.length > 0 && (
              <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl p-8 border border-white/5">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <Users className="text-amber-500" /> Active Clubs
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {council.clubs.map((club: any) => (
                    <Link
                      href={`/clubs/${club.slug}`}
                      key={club.id}
                      className="group p-4 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-colors">
                          <Users className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-200 group-hover:text-white transition-colors">{club.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Events Widget */}
            <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-white/5 sticky top-24">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="text-amber-500 w-5 h-5" /> Council Events
                </h2>
                <span className="text-xs font-bold bg-amber-500/10 text-amber-500 px-2 py-1 rounded">2026</span>
              </div>

              {council.upcoming_events && council.upcoming_events.length > 0 ? (
                <div className="space-y-4">
                  {council.upcoming_events.map((event: any) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-xs font-bold text-amber-500 uppercase tracking-wide">
                          {format(new Date(event.start_date), 'MMM d')}
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      </div>
                      <h3 className="font-bold text-white mb-1 line-clamp-1">{event.title}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Campus Center
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-600">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <p className="text-slate-500 text-sm">No upcoming events.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
