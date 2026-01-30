'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { format } from 'date-fns';
import { Calendar, Award, CheckCircle, Clock, Download, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'student') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [enrollmentsRes, certificatesRes] = await Promise.all([
        api.get(`/events?user_enrollments=true`),
        api.get(`/certificates/user/${user.id}`)
      ]);

      // Get user's enrollments
      const allEvents = enrollmentsRes.data.events || [];
      const userEnrollments = [];

      for (const event of allEvents) {
        try {
          const eventDetail = await api.get(`/events/${event.id}`);
          if (eventDetail.data.event.is_enrolled) {
            userEnrollments.push(eventDetail.data.event);
          }
        } catch (error: any) {
          console.error('Error fetching event detail:', error);
        }
      }

      setEnrollments(userEnrollments);
      setCertificates(certificatesRes.data.certificates || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingEvents = enrollments.filter(e => new Date(e.start_date) > new Date());
  const pastEvents = enrollments.filter(e => new Date(e.start_date) <= new Date());

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['student']}>
        <div className="min-h-screen bg-[#F8FAFC]">
          <Navbar />
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
              <p className="text-slate-400 font-medium animate-pulse">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden font-sans text-slate-800">
        <Navbar />

        {/* Decorative Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-3xl opacity-60"></div>
        </div>

        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{user?.name}</span>
            </h1>
            <p className="text-slate-500 text-lg">Here is an overview of your campus activities.</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatsCard
              icon={Calendar}
              label="Enrolled Events"
              value={enrollments.length}
              color="blue"
              delay={0.1}
            />
            <StatsCard
              icon={Clock}
              label="Upcoming"
              value={upcomingEvents.length}
              color="purple"
              delay={0.2}
            />
            <StatsCard
              icon={Award}
              label="Certificates"
              value={certificates.length}
              color="emerald"
              delay={0.3}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Events (2/3 width) */}
            <div className="lg:col-span-2 space-y-12">

              {/* Upcoming Events */}
              <section>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Upcoming Events</h2>
                </motion.div>

                {upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingEvents.map((event: any, i: number) => (
                      <EventCard key={event.id} event={event} type="upcoming" index={i} />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No upcoming events. Explore clubs to enroll!" delay={0.5} />
                )}
              </section>

              {/* Past Events */}
              <section>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className="p-2 bg-slate-100 rounded-xl text-slate-600">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Past Activities</h2>
                </motion.div>

                {pastEvents.length > 0 ? (
                  <div className="space-y-4">
                    {pastEvents.map((event: any, i: number) => (
                      <EventCard key={event.id} event={event} type="past" index={i} />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No past activity yet." delay={0.7} />
                )}
              </section>
            </div>

            {/* Right Column: Certificates (1/3 width) */}
            <div className="lg:col-span-1">
              <section className="sticky top-24">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
                    <Award className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Certificates</h2>
                </motion.div>

                {certificates.length > 0 ? (
                  <div className="space-y-4">
                    {certificates.map((cert: any, i: number) => (
                      <CertificateCard key={cert.id} cert={cert} index={i} />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm text-center"
                  >
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Award className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 mb-2">No Certificates Yet</h3>
                    <p className="text-slate-500 text-sm mb-6">Participate in events and workshops to earn verified certificates.</p>
                    <Link href="/events" className="inline-flex items-center text-blue-600 font-bold text-sm hover:underline">
                      Browse Events <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </motion.div>
                )}
              </section>
            </div>
          </div>

        </main>
      </div>
    </ProtectedRoute>
  );
}

// --- Subcomponents ---

function StatsCard({ icon: Icon, label, value, color, delay }: any) {
  const colorStyles: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="p-6 bg-white rounded-3xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-slate-100 hover:-translate-y-1 transition-transform duration-300 flex items-center gap-5"
    >
      <div className={`p-4 rounded-2xl ${colorStyles[color]} shadow-sm`}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <p className="text-slate-500 font-medium text-sm uppercase tracking-wide">{label}</p>
        <p className="text-4xl font-black text-slate-800 tracking-tight mt-1">{value}</p>
      </div>
    </motion.div>
  );
}

function EventCard({ event, type, index }: any) {
  const isUpcoming = type === 'upcoming';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
      className={`group flex flex-col md:flex-row gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 hover:border-${isUpcoming ? 'blue' : 'slate'}-200`}
    >
      <div className={`flex-shrink-0 w-full md:w-24 h-24 rounded-2xl ${isUpcoming ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'} flex flex-col items-center justify-center border border-${isUpcoming ? 'blue' : 'slate'}-100`}>
        <span className="text-xs font-bold uppercase tracking-wider">{format(new Date(event.start_date), 'MMM')}</span>
        <span className="text-3xl font-black">{format(new Date(event.start_date), 'dd')}</span>
      </div>

      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{event.title}</h3>
          {isUpcoming ? (
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">Enrolled</span>
          ) : event.attended && (
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Attended
            </span>
          )}
        </div>

        <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2 pr-4">{event.description}</p>

        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wide">
          <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
            <Clock className="w-3 h-3" />
            {format(new Date(event.start_date), 'h:mm a')}
          </span>
          {event.venue && (
            <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
              {event.venue}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function CertificateCard({ cert, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 + (index * 0.1), duration: 0.5 }}
      className="p-5 bg-white rounded-2xl border border-emerald-100/50 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
          <Award className="w-6 h-6" />
        </div>
        <button
          onClick={() => window.open(`/certificates/${cert.certificate_id}`, '_blank')}
          className="p-2 text-slate-400 hover:text-white hover:bg-emerald-500 rounded-full transition-all shadow-sm"
          title="Download Certificate"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      <h4 className="font-bold text-slate-800 leading-tight mb-1 group-hover:text-emerald-700 transition-colors pr-8">{cert.event_title}</h4>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md tracking-wider">Verified</span>
        <p className="text-xs text-slate-400 font-mono">#{cert.certificate_id.substring(0, 8)}</p>
      </div>

      <div className="pt-3 border-t border-slate-50 text-xs text-slate-400 flex justify-between items-center">
        <span className="font-medium text-slate-500">Issued Date</span>
        <span className="font-bold text-slate-700">{format(new Date(cert.issued_at), 'MMM d, yyyy')}</span>
      </div>
    </motion.div>
  );
}

function EmptyState({ message, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="py-12 text-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50"
    >
      <p className="text-slate-400 font-medium">{message}</p>
    </motion.div>
  );
}
