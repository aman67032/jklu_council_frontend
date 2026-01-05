'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar, MapPin, Clock, Search, Filter, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EventsPage() {
    const router = useRouter();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('upcoming'); // upcoming, past, all

    useEffect(() => {
        fetchEvents();
    }, [filter]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            let url = '/events?status=approved';
            if (filter === 'upcoming') {
                url += '&upcoming=true';
            }
            // Note: Backend doesn't strictly support 'past' param yet explicitly, but upcoming=true filters future. 
            // We can filter client side or just fetch all for 'all'/'past' if backend doesn't support 'past' flag.
            // For now, let's fetch all and filter in client if needed, or rely on what we have.
            // Actually backend supports `upcoming=true`. If not passed, it returns all? Let's assume so.

            const response = await api.get(url);
            setEvents(response.data.events || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description?.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'past') {
            return matchesSearch && new Date(event.start_date) < new Date();
        }
        return matchesSearch;
    });

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

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Events</h1>
                        <p className="mt-2 text-gray-600">Discover what's happening on campus</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                            <button
                                onClick={() => setFilter('upcoming')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'upcoming' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Upcoming
                            </button>
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('past')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'past' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Past
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <div
                            key={event.id}
                            className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100 flex flex-col cursor-pointer"
                            onClick={() => router.push(`/events/${event.id}`)}
                        >
                            <div className="p-6 flex-1">
                                <div className="flex gap-2 mb-3">
                                    {event.council_name && (
                                        <span className="px-2 py-1 text-xs font-semibold bg-blue-50 text-blue-600 rounded-full">
                                            {event.council_name}
                                        </span>
                                    )}
                                    {event.club_name && (
                                        <span className="px-2 py-1 text-xs font-semibold bg-purple-50 text-purple-600 rounded-full">
                                            {event.club_name}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {event.title}
                                </h3>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                        {format(new Date(event.start_date), 'MMM d, yyyy')}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                        {format(new Date(event.start_date), 'h:mm a')}
                                    </div>
                                    {event.venue && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                            {event.venue}
                                        </div>
                                    )}
                                </div>

                                <p className="text-gray-600 text-sm line-clamp-2">
                                    {event.description}
                                </p>
                            </div>

                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-sm font-medium text-blue-600 group-hover:text-blue-700">
                                View Details
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredEvents.length === 0 && (
                    <div className="text-center py-12">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No events found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
