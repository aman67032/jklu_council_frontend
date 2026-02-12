'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { format } from 'date-fns';
import Image from 'next/image';
import { Calendar, MapPin, Users, Mail, User, Info, Image as ImageIcon, ChevronLeft } from 'lucide-react';
import { getClubLogo } from '@/lib/club-assets';
import Link from 'next/link';
import ClubEventCard from '@/components/ClubEventCard';

// Helper to generate a consistent theme color based on string
const getThemeColor = (str: string) => {
  const n = str.toLowerCase();
  if (n.includes('tech') || n.includes('code') || n.includes('cyber')) return { primary: '#3B82F6', secondary: 'rgba(59, 130, 246, 0.1)', gradient: 'from-blue-600 to-indigo-600' };
  if (n.includes('art') || n.includes('design') || n.includes('drama')) return { primary: '#F97316', secondary: 'rgba(249, 115, 22, 0.1)', gradient: 'from-orange-500 to-red-600' };
  if (n.includes('music') || n.includes('dance')) return { primary: '#F59E0B', secondary: 'rgba(245, 158, 11, 0.1)', gradient: 'from-amber-500 to-orange-600' };
  if (n.includes('sport') || n.includes('game')) return { primary: '#EF4444', secondary: 'rgba(239, 68, 68, 0.1)', gradient: 'from-red-600 to-orange-700' };
  return { primary: '#3B82F6', secondary: 'rgba(59, 130, 246, 0.1)', gradient: 'from-blue-500 to-cyan-500' };
};

export default function ClubDetailPage() {
  const params = useParams();
  const [club, setClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<any>({ primary: '#3B82F6', gradient: 'from-blue-600 to-indigo-600' });

  useEffect(() => {
    fetchClub();
  }, [params.slug]);

  const fetchClub = async () => {
    try {
      const response = await api.get(`/clubs/${params.slug}`);
      setClub(response.data.club);
      if (response.data.club) {
        setTheme(getThemeColor(response.data.club.name));
      }
    } catch (error) {
      console.error('Error fetching club:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-800 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-[#050510] text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h2 className="text-2xl font-bold mb-4">Club not found</h2>
          <Link href="/clubs" className="text-blue-500 hover:text-blue-400">Back to Clubs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050510] text-gray-100 pb-20 overflow-x-hidden selection:bg-orange-500/30 selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
      </div>

      <Navbar />

      {/* Dynamic Header */}
      <div className={`relative pt-32 pb-20 px-4 overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-10`}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050510]"></div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-8 animate-fade-in-up">
          <Link href="/clubs" className="absolute top-[-60px] left-0 text-gray-500 hover:text-white flex items-center transition-colors">
            <ChevronLeft className="w-5 h-5 mr-1" /> Back to Clubs
          </Link>

          <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-900/50 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl relative overflow-hidden group">
            {getClubLogo(club.slug) ? (
              <div className="relative w-full h-full p-4 group-hover:scale-110 transition-transform duration-500">
                <Image
                  src={getClubLogo(club.slug)!}
                  alt={`${club.name} logo`}
                  fill
                  className="object-contain drop-shadow-lg"
                />
              </div>
            ) : (
              <Users className="w-16 h-16 text-white/50" />
            )}
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight text-white">
              {club.name}
            </h1>
            {club.council_name && (
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-sm font-medium text-gray-300">Part of <span className="text-white font-bold">{club.council_name}</span></span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-900/40 backdrop-blur-sm rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Info className="w-6 h-6 mr-3" style={{ color: theme.primary }} />
                About Us
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed whitespace-pre-wrap">
                {club.description || "No description provided yet."}
              </p>
            </div>

            {/* Upcoming Events */}
            <div className="bg-gray-900/40 backdrop-blur-sm rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-3" style={{ color: theme.primary }} />
                Upcoming Events
              </h2>

              {club.events && club.events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {club.events.map((event: any) => (
                    <ClubEventCard
                      key={event.id}
                      id={event.id}
                      title={event.title}
                      date={event.start_date}
                      venue={event.venue}
                      imageUrl={event.image_url}
                      status={event.status}
                      desc={event.description}
                      color={`text-${theme.primary}`}
                      bg={`bg-${theme.primary}/10`}
                      border={`group-hover:border-${theme.primary}/50`}
                      is_enrolled={event.is_enrolled}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-black/20 rounded-2xl border border-white/5 border-dashed">
                  <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No upcoming events scheduled</p>
                </div>
              )}
            </div>

            {/* Gallery Placeholder Moved to bottom or removed if not needed, keeping layout simple as per 'About Us' and 'Events' focus */}
          </div>

          {/* Sidebar - Leadership */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/40 backdrop-blur-sm rounded-3xl p-8 border border-white/5 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                Leadership Team
              </h2>

              <div className="space-y-6">
                {[
                  { title: 'Chairperson', person: club.chair_name, email: club.chair_email },
                  { title: 'Co-Chairperson', person: club.co_chair_name, email: club.co_chair_email },
                  { title: 'Secretary', person: club.secretary_name, email: club.secretary_email },
                  { title: 'General Secretary', person: club.general_secretary_name, email: club.general_secretary_email },
                ].map((role, idx) => role.person && (
                  <div key={idx} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 shadow-lg">
                      <User className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-0.5">{role.title}</p>
                      <p className="font-bold text-gray-200 group-hover:text-white transition-colors">{role.person}</p>
                      {role.email && (
                        <a href={`mailto:${role.email}`} className="text-xs text-blue-500 hover:text-blue-400 mt-0.5 block transition-colors">
                          {role.email}
                        </a>
                      )}
                    </div>
                  </div>
                ))}

                {(!club.chair_name && !club.secretary_name) && (
                  <p className="text-gray-500 italic text-center py-4">Leadership information updating...</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
