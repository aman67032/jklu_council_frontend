'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import Link from 'next/link';
import { Award, ChevronRight } from 'lucide-react';

export default function CouncilsPage() {
    const [councils, setCouncils] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCouncils();
    }, []);

    const fetchCouncils = async () => {
        try {
            const response = await api.get('/councils');
            setCouncils(response.data.councils || []);
        } catch (error) {
            console.error('Error fetching councils:', error);
        } finally {
            setLoading(false);
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

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Student Councils</h1>
                    <p className="mt-2 text-gray-600">Governing bodies managing student activities and affairs</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {councils.map((council) => (
                        <Link
                            href={`/councils/${council.slug}`}
                            key={council.id}
                            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 flex flex-col"
                        >
                            <div className="p-6 flex-1">
                                <div className="mb-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                        <Award className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {council.name}
                                </h3>

                                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                    {council.description || 'No description available.'}
                                </p>

                                {council.club_count !== undefined && (
                                    <p className="text-sm text-gray-500">
                                        <span className="font-semibold text-gray-900">{council.club_count}</span> Clubs under this council
                                    </p>
                                )}
                            </div>

                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-sm font-medium text-blue-600 group-hover:text-blue-700">
                                View Details
                                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
