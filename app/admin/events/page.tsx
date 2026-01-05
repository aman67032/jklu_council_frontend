'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';

export default function AdminEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      const params = filter === 'all' ? {} : { status: filter };
      const response = await api.get('/events', { params });
      setEvents(response.data.events || []);
    } catch (error: any) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId: number) => {
    try {
      await api.post(`/events/${eventId}/approve`);
      fetchEvents();
      alert('Event approved successfully');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to approve event');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['super_admin', 'head_student_affairs', 'executive_student_affairs', 'president', 'council_admin']}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['super_admin', 'head_student_affairs', 'executive_student_affairs', 'president', 'council_admin', 'club_chair', 'club_co_chair', 'club_secretary', 'club_general_secretary']}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Events</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
            </select>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            {events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event: any) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {format(new Date(event.start_date), 'MMM d, yyyy h:mm a')}
                          </div>
                          {event.venue && (
                            <div className="flex items-center">
                              <span>{event.venue}</span>
                            </div>
                          )}
                          {event.enrollment_count > 0 && (
                            <div className="flex items-center">
                              <span>{event.enrollment_count} enrolled</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          event.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {event.status}
                        </span>
                        {event.status === 'pending' && (
                          <button
                            onClick={() => handleApprove(event.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No events found</p>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

