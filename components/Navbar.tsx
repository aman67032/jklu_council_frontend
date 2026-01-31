'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, User, Home, Users, BarChart3, Award, Calendar, Briefcase } from 'lucide-react';
import BB8Switch from './BB8Switch';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isTechClub = pathname === '/clubs/technology-club';
  const isMusicClub = pathname === '/clubs/music-club';
  const isRoboticsClub = pathname === '/clubs/robotics-club';
  const isDramaClub = pathname === '/clubs/drama-club';
  const isPhotographyClub = pathname === '/clubs/photography-club';
  const isLiteraryClub = pathname === '/clubs/literary-club';
  const isMediaClub = pathname === '/clubs/media-club';
  const isAstronomyClub = pathname === '/clubs/astronomy-club';
  const isDesignClub = pathname === '/clubs/design-club';
  const isBusinessClub = pathname === '/clubs/business-club';

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl bg-[var(--nav-bg)]/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-2xl transition-all duration-300">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="flex items-center gap-4 transition-transform duration-300 group-hover:scale-105">
                {/* Light Mode Logo */}
                <img
                  src="/black_jklu_logo.png"
                  alt="JKLU Logo"
                  className="h-12 w-auto object-contain dark:hidden"
                />
                {/* Dark Mode Logo */}
                <img
                  src="/white_jklu_logo.png"
                  alt="JKLU Logo"
                  className="h-12 w-auto object-contain hidden dark:block"
                />
                <div className="h-8 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1"></div>
                <img
                  src="/council_logo.png"
                  alt="Council Logo"
                  className="h-14 w-auto object-contain"
                />
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 ml-4">
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
              <NavLink href="/coordinators" icon={<Briefcase className="w-4 h-4" />}>
                Coordinators
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

          {/* Right Text / Actions */}
          <div className="flex items-center space-x-6">
            {!isTechClub && !isMusicClub && !isRoboticsClub && !isDramaClub && !isPhotographyClub && !isLiteraryClub && !isMediaClub && !isAstronomyClub && !isDesignClub && !isBusinessClub && (
              <div className="scale-75 origin-right hover:rotate-12 transition-transform duration-500">
                <BB8Switch />
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{user.name}</span>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded-full font-bold">
                    {user.role.replace(/_/g, ' ')}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-300 hover:rotate-90"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="relative inline-flex items-center px-6 py-2.5 overflow-hidden text-sm font-bold text-white transition-all duration-300 bg-[var(--primary)] rounded-xl group hover:bg-[var(--primary-dark)] shadow-[0_0_20px_rgba(255,102,0,0.3)] hover:shadow-[0_0_30px_rgba(255,102,0,0.6)] hover:-translate-y-1"
              >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative">Login</span>
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
      className="relative px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors duration-300 group"
    >
      <span className="flex items-center gap-2 relative z-10">
        <span className="group-hover:text-[var(--primary)] transition-colors duration-300 group-hover:scale-110 transform">
          {icon}
        </span>
        {children}
      </span>
      <span className="absolute inset-0 bg-[var(--primary)]/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out origin-center"></span>
      <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[var(--primary)] group-hover:w-1/2 group-hover:left-1/4 transition-all duration-300 ease-out"></span>
    </Link>
  );
}
