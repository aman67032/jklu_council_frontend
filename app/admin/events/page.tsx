'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock, Calendar, Plus, MapPin, Users, Search, ChevronLeft, ChevronRight, X, Loader2, Building2 } from 'lucide-react';

export default function AdminEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Data for Organizers
  const [councils, setCouncils] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [organizerType, setOrganizerType] = useState<'council' | 'club'>('council');
  const [selectedOrganizerId, setSelectedOrganizerId] = useState('');
  const [isOrganizerLocked, setIsOrganizerLocked] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_type: 'workshop',
    venue: '',
    start_date: '',
    end_date: '',
    max_participants: '',
    registration_deadline: '',
    image_url: ''
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9; // Grid layout 3x3

  useEffect(() => {
    fetchEvents();
    fetchOrganizers();
  }, [filter]);

  // Effect to auto-select organizer based on user role
  useEffect(() => {
    if (user && !editingEventId) {
      if (user.managed_club) {
        setOrganizerType('club');
        setSelectedOrganizerId(user.managed_club.id.toString());
        setIsOrganizerLocked(true);
      } else if (user.managed_council) {
        setOrganizerType('council');
        setSelectedOrganizerId(user.managed_council.id.toString());
        setIsOrganizerLocked(true);
      }
    }
  }, [user, editingEventId]);

  const fetchEvents = async () => {
    setLoading(true);
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

  const fetchOrganizers = async () => {
    try {
      const [councilsRes, clubsRes] = await Promise.all([
        api.get('/councils'),
        api.get('/clubs')
      ]);
      setCouncils(councilsRes.data.councils || []);
      setClubs(clubsRes.data.clubs || []);
    } catch (error) {
      console.error('Error fetching organizers:', error);
    }
  };

  const handleApprove = async (eventId: number) => {
    try {
      await api.post(`/events/${eventId}/approve`);
      fetchEvents();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to approve event');
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const payload = {
        ...newEvent,
        max_participants: newEvent.max_participants ? parseInt(newEvent.max_participants) : null,
        council_id: organizerType === 'council' ? selectedOrganizerId : null,
        club_id: organizerType === 'club' ? selectedOrganizerId : null,
      };

      if (editingEventId) {
        await api.put(`/events/${editingEventId}`, payload);
      } else {
        await api.post('/events', payload);
      }

      setIsModalOpen(false);

      // Reset Form
      setNewEvent({
        title: '',
        description: '',
        event_type: 'workshop',
        venue: '',
        start_date: '',
        end_date: '',
        max_participants: '',
        registration_deadline: '',
        image_url: ''
      });
      setEditingEventId(null);
      if (!user?.managed_club && !user?.managed_council) {
        setSelectedOrganizerId('');
        setOrganizerType('council');
      }

      fetchEvents();
    } catch (error: any) {
      console.error('Error saving event:', error);
      alert(error.response?.data?.error || 'Failed to save event');
    } finally {
      setCreateLoading(false);
    }
  };

  // Helper to format date for datetime-local input (YYYY-MM-DDTHH:mm)
  const toLocalISO = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Adjust for timezone offset to get local time
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 16);
  };

  const openEditModal = (event: any) => {
    setEditingEventId(event.id);
    setNewEvent({
      title: event.title,
      description: event.description || '',
      event_type: event.event_type || 'workshop',
      venue: event.venue || '',
      start_date: toLocalISO(event.start_date),
      end_date: toLocalISO(event.end_date),
      max_participants: event.max_participants ? event.max_participants.toString() : '',
      registration_deadline: toLocalISO(event.registration_deadline),
      image_url: event.image_url || ''
    });

    // Set organizer
    if (event.council_id) {
      setOrganizerType('council');
      setSelectedOrganizerId(event.council_id);
    } else if (event.club_id) {
      setOrganizerType('club');
      setSelectedOrganizerId(event.club_id);
    }

    setIsModalOpen(true);
  };


  // Filter & Search Logic
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Pagination Logic
  useEffect(() => {
    setTotalPages(Math.ceil(filteredEvents.length / itemsPerPage));
    setCurrentPage(1);
  }, [searchTerm, events]);

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <ProtectedRoute allowedRoles={['super_admin', 'head_student_affairs', 'executive_student_affairs', 'president', 'council_admin', 'club_chair', 'club_co_chair', 'club_secretary', 'club_general_secretary']}>
      <div className="min-h-screen bg-[#050510] text-gray-100 font-sans selection:bg-orange-500/30">
        <Navbar />

        {/* Background Gradients */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
            <div className="flex items-center group">
              <div className="p-4 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl shadow-blue-900/20 mr-6 backdrop-blur-xl group-hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Calendar className="w-8 h-8 text-blue-500 relative z-10" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">
                  Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">Management</span>
                </h1>
                <p className="text-gray-400 mt-2 text-lg font-light tracking-wide">Plan, Approve & Monitor Events</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative group w-full sm:w-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-orange-500 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3.5 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 outline-none w-full sm:w-64 transition-all shadow-lg text-white placeholder-gray-600 hover:bg-gray-900/80 backdrop-blur-sm"
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full sm:w-auto px-6 py-3.5 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none cursor-pointer shadow-lg text-white appearance-none hover:bg-gray-900/80 backdrop-blur-sm transition-all"
              >
                <option value="all" className="bg-gray-900">All Events</option>
                <option value="pending" className="bg-gray-900">Pending</option>
                <option value="approved" className="bg-gray-900">Approved</option>
              </select>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                <span>Create Event</span>
              </button>
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm animate-pulse mt-4">Loading Events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-white/5 p-12 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-white/10">
                <Calendar className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
              <p className="text-gray-400">Try adjusting your filters or create a new event.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedEvents.map((event) => (
                <div key={event.id} className="group bg-gray-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 flex flex-col h-full">
                  {event.image_url && (
                    <div className="w-full h-48 mb-5 rounded-xl overflow-hidden border border-white/5 relative">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(event.status)}`}>
                      {event.status.toUpperCase()}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(event);
                        }}
                        className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                        title="Edit Event"
                      >
                        Edit
                      </button>
                      {event.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(event.id)}
                          className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors"
                          title="Approve Event"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">{event.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">{event.description}</p>

                  <div className="space-y-2.5 text-sm text-gray-500 mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-pink-500" />
                      <span className="truncate">
                        {event.council_name || event.club_name || event.created_by_name || 'Unknown Organizer'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>{format(new Date(event.start_date), 'MMM d, yyyy • h:mm a')}</span>
                    </div>
                    {event.venue && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    )}
                    {event.enrollment_count > 0 && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span>{event.enrollment_count} Enrolled</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredEvents.length > itemsPerPage && (
            <div className="mt-12 flex justify-center gap-4">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-3 bg-gray-900/50 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="flex items-center px-6 bg-gray-900/50 border border-white/10 rounded-xl text-gray-400 font-medium">
                Page <span className="text-white mx-1">{currentPage}</span> of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-3 bg-gray-900/50 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Create Event Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0a0a18] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200">
              <div className="sticky top-0 bg-[#0a0a18]/95 backdrop-blur-md p-6 border-b border-white/5 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold text-white">
                  {editingEventId ? 'Edit Event' : 'Create New Event'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingEventId(null);
                    setNewEvent({
                      title: '',
                      description: '',
                      event_type: 'workshop',
                      venue: '',
                      start_date: '',
                      end_date: '',
                      max_participants: '',
                      registration_deadline: '',
                      image_url: ''
                    });
                  }}
                  className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="p-6 space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Event Image (Max 1MB)</label>
                  <div className="flex items-center gap-4">
                    {newEvent.image_url && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-700 relative group">
                        <img
                          src={newEvent.image_url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setNewEvent({ ...newEvent, image_url: '' })}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 1024 * 1024) { // 1MB limit
                              alert('Image size must be less than 1MB');
                              e.target.value = ''; // Reset input
                              return;
                            }

                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewEvent({ ...newEvent, image_url: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20"
                      />
                      <p className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, WebP</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Event Title</label>
                  <input
                    type="text"
                    required
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-gray-600"
                    placeholder="e.g. Annual Tech Symposium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-gray-600 resize-none"
                    placeholder="Describe the event details..."
                  />
                </div>

                {/* Organizer Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Organizer Type</label>
                    <select
                      value={organizerType}
                      onChange={(e) => {
                        setOrganizerType(e.target.value as 'council' | 'club');
                        setSelectedOrganizerId('');
                      }}
                      disabled={isOrganizerLocked}
                      className={`w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer ${isOrganizerLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="council" className="bg-gray-900">Council</option>
                      <option value="club" className="bg-gray-900">Club</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Select {organizerType === 'council' ? 'Council' : 'Club'}
                    </label>
                    <select
                      value={selectedOrganizerId}
                      onChange={(e) => setSelectedOrganizerId(e.target.value)}
                      required
                      disabled={isOrganizerLocked}
                      className={`w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer ${isOrganizerLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="" className="bg-gray-900">-- Select --</option>
                      {organizerType === 'council' ? (
                        councils.map(council => (
                          <option key={council.id} value={council.id} className="bg-gray-900">{council.name}</option>
                        ))
                      ) : (
                        clubs.map(club => (
                          <option key={club.id} value={club.id} className="bg-gray-900">{club.name}</option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Event Type</label>
                    <select
                      value={newEvent.event_type}
                      onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value })}
                      className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="workshop" className="bg-gray-900">Workshop</option>
                      <option value="seminar" className="bg-gray-900">Seminar</option>
                      <option value="competition" className="bg-gray-900">Competition</option>
                      <option value="cultural" className="bg-gray-900">Cultural</option>
                      <option value="sports" className="bg-gray-900">Sports</option>
                      <option value="other" className="bg-gray-900">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Venue</label>
                    <input
                      type="text"
                      value={newEvent.venue}
                      onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                      className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-gray-600"
                      placeholder="e.g. Auditorium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={newEvent.start_date}
                      onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })}
                      className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-gray-600 [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">End Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={newEvent.end_date}
                      onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })}
                      className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-gray-600 [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Max Participants (Optional)</label>
                    <input
                      type="number"
                      min="1"
                      value={newEvent.max_participants}
                      onChange={(e) => setNewEvent({ ...newEvent, max_participants: e.target.value })}
                      className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-gray-600"
                      placeholder="Leave empty for unlimited"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Registration Deadline</label>
                    <input
                      type="datetime-local"
                      value={newEvent.registration_deadline}
                      onChange={(e) => setNewEvent({ ...newEvent, registration_deadline: e.target.value })}
                      className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-gray-600 [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingEventId(null);
                      setNewEvent({
                        title: '',
                        description: '',
                        event_type: 'workshop',
                        venue: '',
                        start_date: '',
                        end_date: '',
                        max_participants: '',
                        registration_deadline: '',
                        image_url: ''
                      });
                    }}
                    disabled={createLoading}
                    className="flex-1 px-6 py-3.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {createLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {editingEventId ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingEventId ? 'Update Event' : 'Create Event'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
