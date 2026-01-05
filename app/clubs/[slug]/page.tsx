'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, Mail, User, Info, Image as ImageIcon } from 'lucide-react';

// Helper to generate a consistent theme color based on string
const getThemeColor = (str: string) => {
  const hash = str.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const hue = Math.abs(hash % 360);
  return {
    primary: `hsl(${hue}, 70%, 50%)`,
    secondary: `hsl(${hue}, 70%, 90%)`,
    gradient: `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${(hue + 40) % 360}, 70%, 60%))`
  };
};

export default function ClubDetailPage() {
  const params = useParams();
  const [club, setClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<any>({});

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
      <div className="min-h-screen bg-[var(--background)]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current text-[var(--primary)]"></div>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center text-[var(--text-secondary)]">
          Club not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20">
      <Navbar />

      {/* Dynamic Header */}
      <div className="relative text-white py-24 px-4 overflow-hidden"
        style={{ background: theme.gradient }}>
        {/* SVG Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl">
            <Users className="w-16 h-16 text-white" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tight">{club.name}</h1>
            {club.council_name && (
              <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium border border-white/20">
                Part of {club.council_name}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-lg border border-[var(--card-border)]">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center">
                <Info className="w-6 h-6 mr-2" style={{ color: theme.primary }} />
                About Us
              </h2>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed whitespace-pre-wrap">
                {club.description || "No description provided yet."}
              </p>
            </div>

            {/* Image Placeholders */}
            <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-lg border border-[var(--card-border)]">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center">
                <ImageIcon className="w-6 h-6 mr-2" style={{ color: theme.primary }} />
                Gallery
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <span className="text-gray-400 font-medium">Club Image 1 Placeholder</span>
                </div>
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <span className="text-gray-400 font-medium">Club Image 2 Placeholder</span>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            {club.upcoming_events && club.upcoming_events.length > 0 && (
              <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-lg border border-[var(--card-border)]">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center">
                  <Calendar className="w-6 h-6 mr-2" style={{ color: theme.primary }} />
                  Upcoming Events
                </h2>
                <div className="space-y-4">
                  {club.upcoming_events.map((event: any) => (
                    <div key={event.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl bg-[var(--background)] border border-[var(--card-border)] hover:border-[var(--primary)] transition-colors">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">{event.title}</h3>
                        <div className="text-sm text-[var(--text-secondary)] mt-1 flex flex-wrap gap-4">
                          <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {format(new Date(event.start_date), 'PPP p')}</span>
                          {event.venue && <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {event.venue}</span>}
                        </div>
                      </div>
                      <div className="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap" style={{ background: theme.secondary, color: theme.primary }}>
                        {event.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Leadership */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-lg border border-[var(--card-border)] sticky top-24">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 border-b border-[var(--card-border)] pb-4">
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
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: theme.primary }}>
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">{role.title}</p>
                      <p className="font-bold text-[var(--text-primary)]">{role.person.name}</p>
                      {role.email && (
                        <a href={`mailto:${role.email}`} className="text-sm hover:underline mt-0.5 block" style={{ color: theme.primary }}>
                          {role.email}
                        </a>
                      )}
                    </div>
                  </div>
                ))}

                {(!club.chair_name && !club.secretary_name) && (
                  <p className="text-[var(--text-secondary)] italic">Leadership information updating...</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
