'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { format } from 'date-fns';
import { Calendar, Award, CheckCircle, Clock, Download } from 'lucide-react';

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
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-blue-600 mr-4" />
                <div>
                  <p className="text-sm text-gray-600">Enrolled Events</p>
                  <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-yellow-600 mr-4" />
                <div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900">{upcomingEvents.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Award className="w-8 h-8 text-green-600 mr-4" />
                <div>
                  <p className="text-sm text-gray-600">Certificates</p>
                  <p className="text-2xl font-bold text-gray-900">{certificates.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event: any) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>{format(new Date(event.start_date), 'MMMM d, yyyy h:mm a')}</p>
                          {event.venue && <p>{event.venue}</p>}
                        </div>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                        Enrolled
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No upcoming events</p>
            )}
          </div>

          {/* Past Events */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Past Events</h2>
            {pastEvents.length > 0 ? (
              <div className="space-y-4">
                {pastEvents.map((event: any) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>{format(new Date(event.start_date), 'MMMM d, yyyy')}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {event.attended && (
                          <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Attended
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No past events</p>
            )}
          </div>

          {/* Certificates */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Certificates</h2>
            {certificates.length > 0 ? (
              <div className="space-y-4">
                {certificates.map((cert: any) => (
                  <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{cert.event_title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Certificate ID: {cert.certificate_id}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Issued: {format(new Date(cert.issued_at), 'MMMM d, yyyy')}
                        </p>
                      </div>
                      <button
                        onClick={() => window.open(`/certificates/${cert.certificate_id}`, '_blank')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No certificates yet</p>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

