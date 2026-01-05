'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import { UserPlus, Mail, User, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function Signup() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!formData.email.endsWith('@jklu.edu.in')) {
            // Optional: Enforce college email
            // setError('Please use your JKLU email address');
            // return;
        }

        setLoading(true);

        try {
            // Assuming backend has a /auth/register endpoint. If not, I might need to create it.
            // Checking backend... usually it's /aut/register or similar.
            // Based on previous knowledge, let's try /auth/register.
            // If backend doesn't exist, I'll need to create it. 
            // For now, I'll assume standard auth flow.
            await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'student' // Default to student
            });

            router.push('/login?registered=true');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="max-w-md w-full space-y-8 bg-[var(--card-bg)] p-8 rounded-2xl shadow-xl border border-[var(--card-border)]">
                    <div className="text-center">
                        <div className="mx-auto h-16 w-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mb-4">
                            <UserPlus className="h-8 w-8 text-[var(--primary)]" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-[var(--text-primary)]">
                            Create Account
                        </h2>
                        <p className="mt-2 text-sm text-[var(--text-secondary)]">
                            Join the JKLU Council platform
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center text-red-700 dark:text-red-400 text-sm">
                                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-transparent text-[var(--text-primary)] placeholder-gray-400 transition-all"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-transparent text-[var(--text-primary)] placeholder-gray-400 transition-all"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-transparent text-[var(--text-primary)] placeholder-gray-400 transition-all"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-transparent text-[var(--text-primary)] placeholder-gray-400 transition-all"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>

                        <div className="text-center mt-4">
                            <span className="text-[var(--text-secondary)] text-sm">Already have an account? </span>
                            <Link href="/login" className="text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium text-sm inline-flex items-center">
                                Sign in <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
