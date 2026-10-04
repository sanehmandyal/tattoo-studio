import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  Image,
  Sparkles,
  BookOpen,
  MessageSquare,
  Settings,
  Calendar,
  LogOut,
  ExternalLink,
  Shield,
  Star,
  HeartPulse,
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout, isAdmin, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-studio-darker flex items-center justify-center text-studio-textMuted">
        Verifying master administrator clearance...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-studio-darker flex flex-col items-center justify-center p-4 text-center space-y-4">
        <Shield className="w-12 h-12 text-red-500" />
        <h2 className="text-2xl font-bold text-studio-textMain">Access Denied: Master Admin Only</h2>
        <p className="text-xs text-studio-textMuted max-w-sm">
          This control center is restricted to the Land of God Tattoo Studio administrator.
        </p>
        <Link
          to="/login"
          className="bg-studio-bronze text-white font-bold px-6 py-2.5 text-xs uppercase tracking-wider rounded shadow-bronze"
        >
          Sign In as Admin
        </Link>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Tattoo Portfolio & Gallery', path: '/admin/portfolio', icon: Image },
    { name: '3D Placement Designs', path: '/admin/designs', icon: Sparkles },
    { name: 'Client Appointments', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'Reviews & Testimonials', path: '/admin/reviews', icon: Star },
    { name: 'Sacred Aftercare Guide', path: '/admin/aftercare', icon: HeartPulse },
    { name: 'Ink Well Blog Articles', path: '/admin/blogs', icon: BookOpen },
    { name: 'Consultation Inquiries', path: '/admin/contacts', icon: MessageSquare },
    { name: 'Studio Calendar', path: '/admin/calendar', icon: Calendar },
    { name: 'Studio & Site Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-studio-bg flex">
      {/* Admin Left Sidebar */}
      <aside className="w-72 bg-studio-darker border-r border-studio-border/40 flex flex-col justify-between shrink-0 hidden md:flex z-30">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-studio-border/30 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/logo.png" alt="Land of God Logo" className="w-8 h-8 object-contain" />
              <div className="text-left">
                <span className="font-condensed font-black text-sm tracking-wider text-studio-textMain block uppercase leading-tight">
                  LAND OF GOD
                </span>
                <span className="text-[10px] text-studio-gold tracking-widest uppercase font-semibold">
                  Master Control
                </span>
              </div>
            </Link>
            <span className="text-[9px] uppercase font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
              Admin
            </span>
          </div>

          {/* Nav items */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-studio-bronze text-studio-darker font-bold shadow-bronze'
                      : 'text-studio-textMuted hover:text-studio-textMain hover:bg-studio-card'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & links */}
        <div className="p-4 border-t border-studio-border/30 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center space-x-2 text-xs text-studio-textMuted hover:text-studio-bronzeLight px-2 py-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Public Site</span>
          </Link>

          <div className="flex items-center justify-between pt-2 border-t border-studio-border/20 px-2">
            <div className="text-left max-w-[170px] truncate">
              <p className="text-xs font-bold text-studio-textMain truncate">{user.name}</p>
              <p className="text-[10px] text-studio-textMuted truncate">{user.email}</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-1.5 text-studio-textMuted hover:text-red-400"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Mobile Header Bar */}
        <header className="md:hidden bg-studio-darker border-b border-studio-border/40 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
            <span className="font-condensed font-black text-sm text-studio-textMain uppercase">
              LAND OF GOD ADMIN
            </span>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <Link to="/" className="text-studio-bronzeLight">Live Site</Link>
            <button onClick={logout} className="text-red-400">Logout</button>
          </div>
        </header>

        <main className="p-6 sm:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
