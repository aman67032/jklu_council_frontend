'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import { LogOut, User, Home, Users, BarChart3, Award, Calendar, Sun, Moon } from 'lucide-react';
import BB8Switch from './BB8Switch';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-[var(--nav-bg)] backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-[var(--card-border)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="flex items-center gap-4">
                {/* Light Mode Logo */}
                <img
                  src="/black_jklu_logo.png"
                  alt="JKLU Logo"
                  className="h-16 w-auto object-contain dark:hidden"
                />
                {/* Dark Mode Logo */}
                <img
                  src="/white_jklu_logo.png"
                  alt="JKLU Logo"
                  className="h-16 w-auto object-contain hidden dark:block"
                />
                <div className="h-10 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1"></div>
                <img
                  src="/council_logo.png"
                  alt="Council Logo"
                  className="h-20 w-auto object-contain"
                />
              </div>
            </Link>

            <div className="hidden md:flex md:space-x-2 ml-4 text-sm font-medium">
              <NavLink href="/" icon={<Home className="w-4 h-4" />}>
                Home
              </NavLink>
              <NavLink href="/events" icon={<Calendar className="w-4 h-4" />}>
                Events
              </NavLink>
              <NavLink href="/clubs" icon={<Users className="w-4 h-4" />}>
                Clubs
              </NavLink>
              <NavLink href="/councils" icon={<Award className="w-4 h-4" />}>
                Councils
              </NavLink>

              {user && user.role === 'student' && (
                <NavLink href="/dashboard" icon={<User className="w-4 h-4" />}>
                  Dashboard
                </NavLink>
              )}
              {user && user.role !== 'student' && (
                <>
                  <NavLink href="/admin" icon={<BarChart3 className="w-4 h-4" />}>
                    Admin
                  </NavLink>
                  <NavLink href="/admin/events" icon={<Calendar className="w-4 h-4" />}>
                    Manage Events
                  </NavLink>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="scale-75 origin-right">
              <BB8Switch />
            </div>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{user.name}</span>
                  <span className="text-xs text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded-full font-medium capitalize">
                    {user.role.replace(/_/g, ' ')}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] rounded-full hover:opacity-90 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 rounded-lg transition-colors group"
    >
      {icon && <span className="mr-2 group-hover:text-[var(--primary)] text-[var(--text-secondary)] transition-colors">{icon}</span>}
      {children}
    </Link>
  );
}
