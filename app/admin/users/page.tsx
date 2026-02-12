'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { Users, Search, Edit2, Check, X, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

export default function UserManagement() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState<any>(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);
    const [filterRole, setFilterRole] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    const roles = [
        { value: 'student', label: 'Student' },
        { value: 'council_admin', label: 'Council Admin' },
        { value: 'club_chair', label: 'Club Chair' },
        { value: 'club_co_chair', label: 'Club Co-Chair' },
        { value: 'club_secretary', label: 'Club Secretary' },
        { value: 'club_general_secretary', label: 'Club Gen. Secretary' },
        { value: 'president', label: 'President' },
        { value: 'head_student_affairs', label: 'Head Student Affairs' },
        { value: 'executive_student_affairs', label: 'Executive Student Affairs' },
        { value: 'super_admin', label: 'Super Admin' }
    ];

    useEffect(() => {
        fetchUsers();
    }, [filterRole]); // Refetch when filter changes

    const fetchUsers = async () => {
        setLoading(true);
        try {
            let url = '/users';
            const params = new URLSearchParams();
            if (filterRole) params.append('role', filterRole);

            const response = await api.get(`${url}?${params.toString()}`);
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async () => {
        if (!editingUser || !selectedRole) return;

        setUpdateLoading(true);
        try {
            await api.put(`/users/${editingUser.id}`, {
                role: selectedRole
            });

            // Update local state
            setUsers(users.map(u =>
                u.id === editingUser.id ? { ...u, role: selectedRole } : u
            ));

            setEditingUser(null);
            setSelectedRole('');
        } catch (error) {
            console.error('Error updating user role:', error);
            alert('Failed to update role. Please try again.');
        } finally {
            setUpdateLoading(false);
        }
    };

    const startEditing = (user: any) => {
        setEditingUser(user);
        setSelectedRole(user.role);
    };

    // Filter users based on search term
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.student_id && user.student_id.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Pagination logic
    useEffect(() => {
        setTotalPages(Math.ceil(filteredUsers.length / itemsPerPage));
        setCurrentPage(1); // Reset to first page on search/filter change
    }, [searchTerm, users]);

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'super_admin': return 'bg-orange-500/20 text-orange-300 border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.2)]';
            case 'head_student_affairs':
            case 'executive_student_affairs': return 'bg-orange-900/40 text-orange-200 border-orange-700/50';
            case 'president': return 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]';
            case 'council_admin': return 'bg-blue-900/40 text-blue-200 border-blue-700/50';
            case 'club_chair':
            case 'club_co_chair': return 'bg-cyan-900/40 text-cyan-200 border-cyan-700/50';
            case 'student': return 'bg-gray-800/60 text-gray-400 border-gray-700/50';
            default: return 'bg-indigo-900/40 text-indigo-300 border-indigo-700/50';
        }
    };

    return (
        <ProtectedRoute allowedRoles={['super_admin']}>
            {/* Enforce dark theme wrapper */}
            <div className="min-h-screen bg-[#050510] text-gray-100 selection:bg-orange-500/30 font-sans">
                <Navbar />

                {/* Background Gradients - Blue & Orange Theme */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[120px] animate-pulse delay-1000" />
                    <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                        <div className="flex items-center group">
                            <div className="p-4 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl shadow-blue-900/20 mr-6 backdrop-blur-xl group-hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <Users className="w-8 h-8 text-blue-500 relative z-10" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">
                                    User <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">Management</span>
                                </h1>
                                <p className="text-gray-400 mt-2 text-lg font-light tracking-wide">Control Access & Permissions</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-orange-500 transition-colors duration-300" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-12 pr-4 py-3.5 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 outline-none w-full sm:w-80 transition-all shadow-lg text-white placeholder-gray-600 hover:bg-gray-900/80 backdrop-blur-sm"
                                />
                            </div>

                            <div className="relative group">
                                <select
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                    className="w-full sm:w-auto px-6 py-3.5 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none cursor-pointer shadow-lg text-white appearance-none hover:bg-gray-900/80 backdrop-blur-sm transition-all"
                                >
                                    <option value="">All Roles</option>
                                    {roles.map(role => (
                                        <option key={role.value} value={role.value} className="bg-gray-900 text-gray-200">{role.label}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <ChevronLeft className="w-4 h-4 text-gray-500 -rotate-90" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Card */}
                    <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/5 overflow-hidden ring-1 ring-white/5">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-black/40 border-b border-white/5">
                                        <th className="px-8 py-6 text-xs font-bold text-blue-400 uppercase tracking-[0.15em]">User Identity</th>
                                        <th className="px-8 py-6 text-xs font-bold text-orange-400 uppercase tracking-[0.15em]">Assigned Role</th>
                                        <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-[0.15em]">Date Added</th>
                                        <th className="px-8 py-6 text-right text-xs font-bold text-gray-500 uppercase tracking-[0.15em]">Manage</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center justify-center gap-4">
                                                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                                                    <p className="text-gray-500 text-sm animate-pulse">Loading Users...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : paginatedUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-20 text-center text-gray-500">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 ring-1 ring-white/10">
                                                        <Search className="w-8 h-8 text-gray-600" />
                                                    </div>
                                                    <p className="text-lg font-medium text-gray-400">No users found</p>
                                                    <p className="text-sm text-gray-600 mt-1">Try adjusting your search or filters</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedUsers.map((user) => (
                                            <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors duration-200">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center">
                                                        <div className="relative">
                                                            <div className="h-12 w-12 flex-shrink-0 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-900/30 group-hover:scale-105 transition-transform duration-300 ring-2 ring-black">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
                                                        </div>
                                                        <div className="ml-5">
                                                            <div className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">{user.name}</div>
                                                            <div className="text-sm text-gray-400 font-light tracking-wide">{user.email}</div>
                                                            {user.student_id && (
                                                                <div className="text-xs text-gray-600 mt-1 font-mono bg-black/30 px-2 py-0.5 rounded w-fit border border-white/5">{user.student_id}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    {editingUser?.id === user.id ? (
                                                        <div className="relative animate-in fade-in zoom-in duration-200">
                                                            <select
                                                                value={selectedRole}
                                                                onChange={(e) => setSelectedRole(e.target.value)}
                                                                className="w-full px-4 py-2.5 bg-black border border-blue-500 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/40 outline-none shadow-[0_0_15px_rgba(59,130,246,0.2)] text-white"
                                                                autoFocus
                                                            >
                                                                {roles.map(role => (
                                                                    <option key={role.value} value={role.value} className="bg-gray-900 text-gray-200">{role.label}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    ) : (
                                                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] ${getRoleBadgeColor(user.role)}`}>
                                                            <Shield className="w-3.5 h-3.5 mr-2 opacity-80" />
                                                            {user.role.replace(/_/g, ' ').toUpperCase()}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-5 text-sm text-gray-500 font-mono">
                                                    {new Date(user.created_at).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    {editingUser?.id === user.id ? (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={handleUpdateRole}
                                                                disabled={updateLoading}
                                                                className="p-2.5 text-green-400 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl transition-all hover:scale-105 active:scale-95"
                                                                title="Save"
                                                            >
                                                                {updateLoading ? (
                                                                    <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                                                                ) : (
                                                                    <Check className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingUser(null)}
                                                                disabled={updateLoading}
                                                                className="p-2.5 text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all hover:scale-105 active:scale-95"
                                                                title="Cancel"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => startEditing(user)}
                                                            disabled={currentUser?.id === user.id}
                                                            className={`p-2.5 text-gray-400 hover:text-white hover:bg-blue-600 rounded-xl transition-all duration-300 ${currentUser?.id === user.id ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]'}`}
                                                            title="Edit Role"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination - Dark Mode */}
                        {!loading && filteredUsers.length > itemsPerPage && (
                            <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between bg-black/20">
                                <span className="text-sm text-gray-500">
                                    Showing <span className="font-medium text-white">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-medium text-white">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="font-medium text-white">{filteredUsers.length}</span> users
                                </span>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="text-sm font-medium text-gray-300 bg-white/5 px-4 py-1.5 rounded-lg border border-white/5">
                                        Page <span className="text-white">{currentPage}</span> of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
