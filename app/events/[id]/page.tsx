'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { format } from 'date-fns';
import { Calendar, MapPin, Clock, Users, CheckCircle, ArrowLeft, Share2, AlertCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${params.id}`);
      setEvent(response.data.event);
    } catch (error: any) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login?redirect=/events/' + params.id);
      return;
    }

    if (user.role !== 'student') {
      alert('Only students can enroll in events');
      return;
    }

    setEnrolling(true);
    try {
      await api.post(`/events/${params.id}/enroll`);
      // Re-fetch to update UI
      fetchEvent();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="bg-red-500/10 p-4 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Event Not Found</h2>
          <button onClick={() => router.back()} className="text-[var(--primary)] hover:underline">Go Back</button>
        </div>
      </div>
    );
  }

  const isEnrolled = event.is_enrolled;
  const isPast = new Date(event.start_date) < new Date();
  const canEnroll = user?.role === 'student' && !isEnrolled && !isPast && event.status === 'approved';

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300 pb-20">
      <Navbar />

      {/* Hero Header with Glassmorphism */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}></div>
          {/* Event Image Background */}
          {event.image_url ? (
            <>
              <img
                src={event.image_url}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'dark' ? 'from-black via-black/50 to-transparent' : 'from-white via-white/50 to-transparent'}`}></div>
            </>
          ) : (
            <>
              {/* Ambient Blobs */}
              <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-300'}`}></div>
              <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[100px] opacity-20 ${theme === 'dark' ? 'bg-[var(--primary)]' : 'bg-orange-300'}`}></div>
            </>
          )}
        </div>

        <div className="absolute inset-0 z-10 flex flex-col justify-end pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <button
              onClick={() => router.back()}
              className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md mb-6 w-fit transition-all ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/60 hover:bg-white/80 text-gray-900'
                }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Events</span>
            </button>

            <div className="flex flex-wrap gap-3">
              {event.council_name && (
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest bg-[var(--primary)] text-white rounded-full shadow-lg shadow-[var(--primary)]/20">
                  {event.council_name}
                </span>
              )}
              {event.club_name && (
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest bg-blue-600 text-white rounded-full shadow-lg shadow-blue-600/20">
                  {event.club_name}
                </span>
              )}
            </div>

            <h1 className={`text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl drop-shadow-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {event.title}
            </h1>

            <div className={`flex flex-wrap items-center gap-6 text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[var(--primary)]" />
                {format(new Date(event.start_date), 'MMMM d, yyyy')}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                {format(new Date(event.start_date), 'h:mm a')}
              </div>
              {event.venue && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-500" />
                  {event.venue}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className={`p-8 rounded-3xl border backdrop-blur-xl shadow-xl ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/80 border-white'
              }`}>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>About Event</h2>
              <div className={`prose max-w-none ${theme === 'dark' ? 'prose-invert text-gray-300' : 'text-gray-600'}`}>
                <p className="whitespace-pre-wrap leading-relaxed">{event.description || "No description provided."}</p>
              </div>
            </div>

            {/* Feedback Section (Conditional) */}
            {user?.role === 'student' && isEnrolled && isPast && (
              <div className={`p-8 rounded-3xl border backdrop-blur-xl shadow-xl ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/80 border-white'
                }`}>
                <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Your Feedback</h2>
                <FeedbackForm eventId={params.id as string} theme={theme} />
              </div>
            )}
          </motion.div>

          {/* Sidebar Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Enrollment Card */}
            <div className={`p-6 rounded-3xl border backdrop-blur-xl shadow-xl sticky top-24 ${theme === 'dark' ? 'bg-white/10 border-white/10' : 'bg-white border-white'
              }`}>
              <h3 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Registration</h3>

              <div className="space-y-4 mb-6">
                <div className={`flex justify-between items-center p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Status</span>
                  <span className={`font-bold px-2 py-1 rounded text-xs uppercase ${event.status === 'approved' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                    }`}>
                    {event.status}
                  </span>
                </div>
                <div className={`flex justify-between items-center p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Enrolled</span>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {event.enrollment_count}
                    </span>
                  </div>
                </div>
              </div>

              {user?.role === 'student' ? (
                isEnrolled ? (
                  <div className="w-full py-4 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center gap-3 text-green-500 font-bold">
                    <CheckCircle className="w-5 h-5" />
                    Registered
                  </div>
                ) : canEnroll ? (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full py-4 bg-gradient-to-r from-[var(--primary)] to-orange-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrolling ? 'Registering...' : 'Register Now'}
                  </button>
                ) : (
                  <div className={`w-full py-4 text-center font-medium rounded-2xl ${theme === 'dark' ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400'
                    }`}>
                    {isPast ? 'Event Ended' : 'Registration Closed'}
                  </div>
                )
              ) : (
                !user ? (
                  <button
                    onClick={() => router.push(`/login?redirect=/events/${params.id}`)}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
                  >
                    Login to Register
                  </button>
                ) : (
                  <div className="text-center text-sm opacity-60 italic">
                    Only students can register.
                  </div>
                )
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FeedbackForm({ eventId, theme }: { eventId: string, theme: string }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post(`/events/${eventId}/feedback`, { rating, comment });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8 bg-green-500/10 rounded-2xl border border-green-500/20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4 text-green-500">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h4 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Thank You!</h4>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Your feedback helps us improve future events.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-xl text-sm border border-red-500/20 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div>
        <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Rate your experience</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`p-2 transition-all transform hover:scale-110 focus:outline-none ${rating >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                }`}
            >
              <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Comments (Optional)
        </label>
        <textarea
          rows={4}
          className={`w-full rounded-2xl p-4 transition-all outline-none border-2 focus:border-[var(--primary)] ${theme === 'dark'
            ? 'bg-black/20 border-white/10 text-white placeholder-gray-600'
            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
          placeholder="Share your thoughts..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
}
