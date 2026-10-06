import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { systemAPI } from '../services/api';
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
  Database,
  CheckCircle,
  AlertTriangle,
  Info,
  RefreshCw,
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout, isAdmin, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [dbStatus, setDbStatus] = useState(null);
  const [checkingDb, setCheckingDb] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);

  const checkDatabaseStatus = async () => {
    setCheckingDb(true);
    try {
      const res = await systemAPI.getHealth();
      setDbStatus(res);
    } catch (err) {
      setDbStatus({ isPersistent: false, storageType: 'Offline / In-Memory Fallback' });
    } finally {
      setCheckingDb(false);
    }
  };

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

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

  const isPersistent = dbStatus?.isPersistent;

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

          {/* Database Persistence Status Widget */}
          <div className="px-4 pt-3 pb-1">
            <button
              onClick={() => setShowDbModal(true)}
              className={`w-full text-left p-2 rounded-lg border transition-all text-[11px] flex items-center justify-between ${
                isPersistent
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/60'
                  : 'bg-amber-950/50 border-amber-500/50 text-amber-300 hover:bg-amber-950/70 animate-pulse'
              }`}
            >
              <div className="flex items-center space-x-2 truncate">
                {isPersistent ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
                <div className="truncate">
                  <span className="font-bold block truncate">
                    {isPersistent ? 'Permanent Cloud Atlas' : 'Storage Persistence Check'}
                  </span>
                  <span className="text-[9px] opacity-80 block truncate">
                    {isPersistent ? 'All changes saved permanently' : 'Click to verify IP Access'}
                  </span>
                </div>
              </div>
              <Info className="w-3.5 h-3.5 shrink-0 opacity-60 ml-1" />
            </button>
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
            <Link to="/profile" className="flex items-center space-x-2.5 max-w-[190px] group text-left">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'Master Sunil')}&background=181512&color=d4a359&size=128&bold=true`}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-studio-gold shrink-0"
              />
              <div className="truncate">
                <p className="text-xs font-bold text-studio-textMain truncate group-hover:text-studio-gold transition-colors">{user.name}</p>
                <p className="text-[10px] text-studio-textMuted truncate">Director / Edit Profile</p>
              </div>
            </Link>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-1.5 text-studio-textMuted hover:text-red-400 shrink-0"
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

        {/* Database Notice Bar on mobile or when memory DB is active */}
        {!isPersistent && dbStatus && (
          <div className="bg-amber-950/80 border-b border-amber-500/50 px-4 py-2.5 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Permanent Storage Alert:</strong> Ensure MongoDB Atlas IP Whitelist (0.0.0.0/0) is enabled so changes never disappear on server restart.
              </span>
            </div>
            <button
              onClick={() => setShowDbModal(true)}
              className="bg-amber-400 text-gray-950 font-bold px-3 py-1 rounded text-[11px] uppercase tracking-wider shrink-0 ml-3"
            >
              Setup Guide
            </button>
          </div>
        )}

        <main className="p-6 sm:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Database Cloud Persistence Modal */}
      {showDbModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-studio-card border border-studio-border rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-studio-border/30 pb-3">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-studio-gold" />
                <h3 className="font-condensed font-bold text-xl text-studio-textMain uppercase">
                  Database Cloud Persistence
                </h3>
              </div>
              <button
                onClick={() => setShowDbModal(false)}
                className="text-studio-textMuted hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-studio-textMuted text-left">
              <div className="p-3 bg-studio-dark/80 rounded-lg border border-studio-border/50 space-y-1.5">
                <p className="font-bold text-studio-textMain flex items-center justify-between">
                  <span>Current Database Connection:</span>
                  <span className={isPersistent ? 'text-emerald-400' : 'text-amber-400'}>
                    {isPersistent ? '✓ Permanent Cloud Atlas' : '⚠️ Temporary In-Memory'}
                  </span>
                </p>
                <p className="text-[11px]">
                  <strong>Host:</strong> {dbStatus?.dbHost || 'cluster0.trkaywa.mongodb.net'}
                </p>
                <p className="text-[11px]">
                  <strong>Storage:</strong> {dbStatus?.storageType || 'MongoDB Atlas Cloud'}
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <h4 className="font-bold text-studio-gold uppercase text-[11px] tracking-wider">
                  How to ensure 100% permanent data storage:
                </h4>
                <ol className="space-y-2 list-decimal list-inside text-studio-textMain text-[11px] leading-relaxed bg-studio-secondary/60 p-3 rounded-lg border border-studio-border/30">
                  <li>
                    Log in to your <strong>MongoDB Atlas Dashboard</strong> (<a href="https://cloud.mongodb.com" target="_blank" rel="noreferrer" className="text-studio-glowCyan underline">cloud.mongodb.com</a>).
                  </li>
                  <li>
                    In the left menu under <strong>Security</strong>, click <strong>Network Access</strong>.
                  </li>
                  <li>
                    Click <strong>+ ADD IP ADDRESS</strong>, select <strong>Allow Access from Anywhere (`0.0.0.0/0`)</strong>, and click <strong>Confirm</strong>.
                  </li>
                  <li>
                    In Render Dashboard (<a href="https://dashboard.render.com" target="_blank" rel="noreferrer" className="text-studio-glowCyan underline">dashboard.render.com</a>), ensure your Environment Variable <code>MONGODB_URI</code> is set.
                  </li>
                </ol>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-studio-border/30">
                <button
                  type="button"
                  onClick={checkDatabaseStatus}
                  disabled={checkingDb}
                  className="px-3 py-2 bg-studio-secondary hover:bg-studio-card border border-studio-border rounded text-xs font-semibold text-studio-bronzeLight flex items-center space-x-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${checkingDb ? 'animate-spin' : ''}`} />
                  <span>{checkingDb ? 'Checking...' : 'Recheck Status'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDbModal(false)}
                  className="bg-studio-bronze hover:bg-studio-bronzeLight text-white font-bold px-5 py-2 uppercase tracking-wider rounded text-xs"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

