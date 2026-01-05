'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { format } from 'date-fns';
import { Calendar, MapPin, Clock, Users, CheckCircle } from 'lucide-react';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
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
      alert('Successfully enrolled! You will receive confirmation email.');
      fetchEvent(); // Refresh event data
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500">Event not found</p>
        </div>
      </div>
    );
  }

  const isEnrolled = event.is_enrolled;
  const isPast = new Date(event.start_date) < new Date();
  const canEnroll = user?.role === 'student' && !isEnrolled && !isPast && event.status === 'approved';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>

          <div className="flex flex-wrap gap-4 mb-6">
            {event.council_name && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {event.council_name}
              </span>
            )}
            {event.club_name && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {event.club_name}
              </span>
            )}
            <span className={`px-3 py-1 rounded-full text-sm ${event.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
              {event.status}
            </span>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center text-gray-700">
              <Calendar className="w-5 h-5 mr-3 text-blue-600" />
              <span>{format(new Date(event.start_date), 'MMMM d, yyyy h:mm a')}</span>
            </div>
            {event.venue && (
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                <span>{event.venue}</span>
              </div>
            )}
            {event.enrollment_count > 0 && (
              <div className="flex items-center text-gray-700">
                <Users className="w-5 h-5 mr-3 text-blue-600" />
                <span>{event.enrollment_count} enrolled</span>
              </div>
            )}
          </div>

          {event.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          {user?.role === 'student' && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              {isEnrolled ? (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-green-800 font-medium">You are enrolled in this event</span>
                  </div>

                  {isPast && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Feedback</h3>
                      <FeedbackForm eventId={params.id as string} />
                    </div>
                  )}
                </div>
              ) : canEnroll ? (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll in Event'}
                </button>
              ) : (
                <p className="text-gray-500 text-center">
                  {isPast ? 'This event has already passed' : 'Enrollment is not available'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FeedbackForm({ eventId }: { eventId: string }) {
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
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <h4 className="text-lg font-medium text-gray-900">Thank you for your feedback!</h4>
        <p className="text-gray-500">Your response has been recorded.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`p-1 focus:outline-none transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-gray-400'
                }`}
            >
              <svg
                className="w-8 h-8 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          Comments (Optional)
        </label>
        <textarea
          id="comment"
          rows={4}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
}

