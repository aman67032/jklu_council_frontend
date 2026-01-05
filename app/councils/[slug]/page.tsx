'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { format } from 'date-fns';
import { Calendar, MapPin, Award, Users, Info, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

// Helper to generate a consistent theme color based on string (Same as Club)
const getThemeColor = (str: string) => {
  const hash = str.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const hue = Math.abs(hash % 360);
  return {
    primary: `hsl(${hue}, 70%, 45%)`, // Slightly darker for councils
    secondary: `hsl(${hue}, 70%, 92%)`,
    gradient: `linear-gradient(135deg, hsl(${hue}, 80%, 40%), hsl(${(hue + 40) % 360}, 80%, 50%))`
  };
};

export default function CouncilDetailPage() {
  const params = useParams();
  const [council, setCouncil] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<any>({});

  useEffect(() => {
    fetchCouncil();
  }, [params.slug]);

  const fetchCouncil = async () => {
    try {
      const response = await api.get(`/councils/${params.slug}`);
      setCouncil(response.data.council);
      if (response.data.council) {
        setTheme(getThemeColor(response.data.council.name));
      }
    } catch (error) {
      console.error('Error fetching council:', error);
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

  if (!council) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center text-[var(--text-secondary)]">
          Council not found
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
        {/* SVG Pattern Overlay - Hexagons for Councils */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hex" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                <path d="M25 0L50 14.4L50 43.3L25 57.7L0 43.3L0 14.4Z" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hex)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-white/20 backdrop-blur-lg rounded-2xl rotate-3 flex items-center justify-center border-4 border-white/30 shadow-2xl">
            <Award className="w-20 h-20 text-white" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tight">{council.name}</h1>
            <p className="text-xl opacity-90 font-light">Student Governing Body</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-lg border border-[var(--card-border)]">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center">
                <Info className="w-6 h-6 mr-2" style={{ color: theme.primary }} />
                About the Council
              </h2>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed whitespace-pre-wrap">
                {council.description || "No description provided."}
              </p>
            </div>

            {/* Image Placeholders */}
            <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-lg border border-[var(--card-border)]">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center">
                <ImageIcon className="w-6 h-6 mr-2" style={{ color: theme.primary }} />
                Highlights Gallery
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <span className="text-gray-400 font-medium">Council Event Image</span>
                </div>
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <span className="text-gray-400 font-medium">Council Team Image</span>
                </div>
              </div>
            </div>

            {/* Associated Clubs */}
            {council.clubs && council.clubs.length > 0 && (
              <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-lg border border-[var(--card-border)]">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center">
                  <Users className="w-6 h-6 mr-2" style={{ color: theme.primary }} />
                  Clubs under {council.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {council.clubs.map((club: any) => (
                    <Link
                      href={`/clubs/${club.slug}`}
                      key={club.id}
                      className="group p-4 rounded-xl bg-[var(--background)] border border-[var(--card-border)] hover:border-[var(--primary)] transition-all flex items-center justify-between"
                    >
                      <span className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">{club.name}</span>
                      <Users className="w-4 h-4 text-[var(--text-secondary)]" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Upcoming Events */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-lg border border-[var(--card-border)] sticky top-24">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 border-b border-[var(--card-border)] pb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" style={{ color: theme.primary }} />
                Council Events
              </h2>

              {council.upcoming_events && council.upcoming_events.length > 0 ? (
                <div className="space-y-4">
                  {council.upcoming_events.map((event: any) => (
                    <div key={event.id} className="pb-4 border-b border-[var(--card-border)] last:border-0 last:pb-0">
                      <Link href={`/events/${event.id}`} className="block group">
                        <h3 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors mb-1">{event.title}</h3>
                        <p className="text-xs text-[var(--text-secondary)] flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {format(new Date(event.start_date), 'MMM d, h:mm a')}
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[var(--text-secondary)] italic text-sm">No upcoming events scheduled.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
