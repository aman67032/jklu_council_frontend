'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { BarChart3, Users, Calendar, Award, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'student') {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics/system');
      setAnalytics(response.data);
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['super_admin', 'head_student_affairs', 'executive_student_affairs', 'president', 'council_admin', 'club_chair', 'club_co_chair', 'club_secretary', 'club_general_secretary']}>
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
          <div className="flex items-center mb-8">
            <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          </div>

          {analytics && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Events</p>
                      <p className="text-3xl font-bold text-gray-900">{analytics.total_events}</p>
                    </div>
                    <Calendar className="w-12 h-12 text-blue-600 opacity-50" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Students</p>
                      <p className="text-3xl font-bold text-gray-900">{analytics.total_students}</p>
                    </div>
                    <Users className="w-12 h-12 text-green-600 opacity-50" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Enrollments</p>
                      <p className="text-3xl font-bold text-gray-900">{analytics.total_enrollments}</p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-purple-600 opacity-50" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Certificates Issued</p>
                      <p className="text-3xl font-bold text-gray-900">{analytics.total_certificates}</p>
                    </div>
                    <Award className="w-12 h-12 text-yellow-600 opacity-50" />
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <p className="text-sm text-gray-600 mb-1">Upcoming Events</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.upcoming_events}</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <p className="text-sm text-gray-600 mb-1">Past Events</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.past_events}</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <p className="text-sm text-gray-600 mb-1">Attendance Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.attendance_rate}%</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

