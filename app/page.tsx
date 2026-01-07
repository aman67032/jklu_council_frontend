'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '@/components/FuturisticCalendar.css';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ChevronRight, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import CouncilLogo3D from '@/components/CouncilLogo3D';
import LaserFlow from '@/components/LaserFlow';
import VideoLanding from '@/components/VideoLanding';

// Dynamically import FloatingLines to avoid SSR issues with Three.js
const FloatingLines = dynamic(() => import('@/components/homebgfile'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 z-0 bg-[var(--background)]" />
});

export default function Home() {
  const router = useRouter();
  const { theme } = useTheme();
  const revealRef = useRef<HTMLDivElement>(null);
  const [date, setDate] = useState<any>(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(false);
  const [isCheckingLanding, setIsCheckingLanding] = useState(true);

  useEffect(() => {
    const hasSeenLanding = sessionStorage.getItem('hasSeenLanding');
    if (!hasSeenLanding) {
      setShowLanding(true);
    }
    setIsCheckingLanding(false);
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events?status=approved');
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedDateEvents = events.filter(event =>
    new Date(event.start_date).toDateString() === date.toDateString()
  );

  const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const hasEvent = events.some(event =>
        new Date(event.start_date).toDateString() === date.toDateString()
      );
      return hasEvent ? 'has-event' : '';
    }
    return '';
  };

  // Theme-aware gradient colors
  const gradientColors = theme === 'dark'
    ? ['#FF6600', '#FF8833', '#0000FF', '#3333FF'] // Dark Orange to Blue
    : ['#FF6600', '#FF9944', '#0066FF', '#3399FF']; // Lighter variants for light mode

  if (isCheckingLanding) {
    return <div className="min-h-screen bg-black" />;
  }

  if (showLanding) {
    return (
      <VideoLanding
        onComplete={() => {
          sessionStorage.setItem('hasSeenLanding', 'true');
          setShowLanding(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300 relative overflow-hidden">
      <Navbar />

      {/* Interactive Floating Lines Background */}
      <div className="fixed inset-0 z-0">
        <FloatingLines
          linesGradient={gradientColors}
          enabledWaves={['bottom', 'middle', 'top']}
          lineCount={[8, 6, 4]}
          lineDistance={[3, 5, 7]}
          bottomWavePosition={{ x: 2.0, y: -0.7, rotate: -1 }}
          middleWavePosition={{ x: 5.0, y: 0.0, rotate: 0.2 }}
          topWavePosition={{ x: 10.0, y: 0.5, rotate: -0.4 }}
          animationSpeed={0.8}
          interactive={true}
          bendRadius={12.0}
          bendStrength={-1.2}
          mouseDamping={0.06}
          parallax={true}
          parallaxStrength={0.15}
          mixBlendMode={theme === 'dark' ? 'screen' : 'normal'}
          isLightMode={theme === 'light'}
        />
      </div>

      {/* Subtle overlay for better text readability */}
      <div className={`fixed inset-0 z-[1] pointer-events-none ${theme === 'light' ? 'bg-[#FAF9F6]/60' : 'bg-black/30'
        }`}></div>

      {/* Hero Section */}
      <div className="relative z-10 pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pb-32 text-center text-[var(--text-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-sm bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)]">
            JKLU Council & Clubs
          </h1>
          <p className={`text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed ${theme === 'light' ? 'text-gray-800' : 'text-white/90'
            }`}>
            The heartbeat of student life. <br className="hidden md:block" />
            Empowering leaders, fostering creativity, and building community.
          </p>

          {/* 3D Council Logo */}
          <div className="mt-2 w-full max-w-3xl mx-auto flex justify-center">
            <CouncilLogo3D />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">

        {/* Leadership Section - Elevated Z-Index to stay above the laser ray */}
        <section className="mb-24 relative z-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Student Leadership</h2>
            <div className="h-1 w-24 bg-[var(--primary)] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
            {/* Leader Card 1 - Deepak Sogani */}
            <div className="group relative">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-white/5 dark:bg-black/20 backdrop-blur-xl shadow-lg border border-white/20 dark:border-white/10 relative transition-all duration-300 hover:shadow-[var(--primary)]/20 hover:shadow-2xl hover:-translate-y-1">
                {/* Decorative Internal Gradient */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-br from-[var(--primary)]/20 via-transparent to-transparent opacity-50"></div>

                <img
                  src="/Council head/Deepak_Sogani_Head - Student Affairs (2).png"
                  alt="Deepak Sogani"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Refined Gradient Overlay for Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80"></div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:-translate-y-1">
                  <h3 className="text-2xl font-bold mb-1 tracking-tight">Deepak Sogani</h3>
                  <p className="text-[var(--primary)] font-bold uppercase tracking-[0.2em] text-[10px] bg-white/10 backdrop-blur-md px-3 py-1 rounded-full w-fit">
                    Head - Student Affairs
                  </p>
                </div>
              </div>
            </div>

            {/* Leader Card 2 - Anushka Pathak */}
            <div className="group relative">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-white/5 dark:bg-black/20 backdrop-blur-xl shadow-lg border border-white/20 dark:border-white/10 relative transition-all duration-300 hover:shadow-[var(--primary)]/20 hover:shadow-2xl hover:-translate-y-1">
                {/* Decorative Internal Gradient */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-bl from-[var(--primary)]/20 via-transparent to-transparent opacity-50"></div>

                <img
                  src="/Council head/Anushka_Pathak_Executive - Student Affairs (2).png"
                  alt="Anushka Pathak"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Refined Gradient Overlay for Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80"></div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:-translate-y-1">
                  <h3 className="text-2xl font-bold mb-1 tracking-tight">Anushka Pathak</h3>
                  <p className="text-[var(--primary)] font-bold uppercase tracking-[0.2em] text-[10px] bg-white/10 backdrop-blur-md px-3 py-1 rounded-full w-fit">
                    Executive - Student Affairs
                  </p>
                </div>
              </div>
            </div>

            {/* Leader Card 3 - Shubham Jain */}
            <div className="group relative">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-white/5 dark:bg-black/20 backdrop-blur-xl shadow-lg border border-white/20 dark:border-white/10 relative transition-all duration-300 hover:shadow-[var(--primary)]/20 hover:shadow-2xl hover:-translate-y-1">
                {/* Decorative Internal Gradient */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-br from-[var(--primary)]/20 via-transparent to-transparent opacity-50"></div>

                <img
                  src="/Council head/President_ShubhamJain.png"
                  alt="Shubham Jain"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Refined Gradient Overlay for Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80"></div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:-translate-y-1">
                  <h3 className="text-2xl font-bold mb-1 tracking-tight">Shubham Jain</h3>
                  <p className="text-[var(--primary)] font-bold uppercase tracking-[0.2em] text-[10px] bg-white/10 backdrop-blur-md px-3 py-1 rounded-full w-fit">
                    President
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Calendar Section - Lower Z-Index so its children stay behind Leadership */}
        <section
          className="relative py-24 px-4 overflow-visible z-10"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            if (revealRef.current) {
              revealRef.current.style.setProperty('--mx', `${x}px`);
              revealRef.current.style.setProperty('--my', `${y}px`);
            }
          }}
          onMouseLeave={() => {
            if (revealRef.current) {
              revealRef.current.style.setProperty('--mx', '-9999px');
              revealRef.current.style.setProperty('--my', '-9999px');
            }
          }}
        >
          {/* Base Section Background Layer - Restored */}
          <div className={`absolute inset-0 z-0 `}></div>

          {/* Unbound LaserFlow Ray - Hits the calendar but stays behind Leadership cards */}
          <div className="absolute top-[-500px] left-0 right-0 h-[calc(100%+430px)] z-0 pointer-events-none overflow-visible mix-blend-screen opacity-90">
            <LaserFlow
              color={theme === 'light' ? '#ff6600' : '#ff9933'}
              fogIntensity={0.5}
              wispIntensity={7}
              wispDensity={1.5}
              horizontalBeamOffset={-0.22}
              verticalBeamOffset={-0.1}
              decay={1.2}
              falloffStart={1.6}
              horizontalSizing={0.7}
            />
          </div>

          <div
            className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              if (revealRef.current) {
                revealRef.current.style.setProperty('--mx', `${x}px`);
                revealRef.current.style.setProperty('--my', `${y}px`);
              }
            }}
            onMouseLeave={() => {
              if (revealRef.current) {
                revealRef.current.style.setProperty('--mx', '-9999px');
                revealRef.current.style.setProperty('--my', '-9999px');
              }
            }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4 tracking-tight">Event Calendar</h2>
              <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
                Stay synchronized with JKLU's vibrant campus life and never miss an opportunity to engage.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Calendar Component Wrapper with Reveal Effect and Orange Border */}
              <div
                ref={revealRef}
                className="group relative bg-white/10 dark:bg-black/20 backdrop-blur-3xl p-8 rounded-[42px] shadow-2xl border-2 border-[var(--primary)] ring-4 ring-[var(--primary)]/20 shadow-[var(--primary)]/10 transition-all duration-500"
                style={{
                  '--mx': '-9999px',
                  '--my': '-9999px'
                } as React.CSSProperties}
              >
                {/* Interactive Reveal Layer */}
                <div
                  className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[42px]"
                  style={{
                    background: theme === 'light'
                      ? 'radial-gradient(circle at var(--mx) var(--my), rgba(255, 102, 0, 0.15), transparent 300px)'
                      : 'radial-gradient(circle at var(--mx) var(--my), rgba(255, 153, 51, 0.2), transparent 350px)',
                    mixBlendMode: 'plus-lighter'
                  }}
                />

                <div className="relative z-10">
                  <Calendar
                    onChange={setDate}
                    value={date}
                    className="w-full text-[var(--text-primary)] react-calendar-laser"
                    tileClassName={getTileClassName}
                  />
                </div>
              </div>

              {/* Event List Side */}
              <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-[38px] p-8 border border-white/20 dark:border-white/10 shadow-xl h-full min-h-[500px]">
                <h3 className="text-2xl font-bold text-[var(--text-primary)] flex items-center border-b border-white/10 pb-6 mb-6">
                  {format(date as Date, 'MMMM d, yyyy')}
                </h3>

                <div className="space-y-4">
                  {selectedDateEvents.length > 0 ? (
                    selectedDateEvents.map(event => (
                      <div
                        key={event.id}
                        onClick={() => router.push(`/events/${event.id}`)}
                        className="group bg-white/5 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-[var(--primary)] hover:bg-white/10 transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20`}>
                            {event.council_name || event.club_name}
                          </span>
                          <div className="p-2 rounded-full bg-white/5 group-hover:bg-[var(--primary)]/20 transition-colors">
                            <ChevronRight className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors" />
                          </div>
                        </div>

                        <h4 className="text-xl font-bold text-[var(--text-primary)] mb-4 group-hover:text-[var(--primary)] transition-colors">{event.title}</h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[var(--text-secondary)] font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center">
                              <CalendarIcon className="w-4 h-4 text-[var(--primary)]" />
                            </div>
                            <span>{format(new Date(event.start_date), 'h:mm a')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center">
                              <MapPin className="w-4 h-4 text-[var(--primary)]" />
                            </div>
                            <span className="truncate">{event.venue}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-[var(--text-secondary)] bg-white/5 rounded-3xl border border-dashed border-white/10">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <CalendarIcon className="w-8 h-8 text-white/20" />
                      </div>
                      <p className="text-lg font-medium">No events scheduled</p>
                      <p className="text-sm">Check another date for activities</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
