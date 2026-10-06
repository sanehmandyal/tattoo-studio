import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, User as UserIcon, Shield, Calendar, LogOut, Compass } from 'lucide-react';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', hash: '#top' },
    { name: 'Portfolio', path: '/portfolio', hash: '#portfolio' },
    { name: '3D Studio', path: '/interactive-3d', hash: '#interactive-3d' },
    { name: 'Reviews', path: '/reviews', hash: '#reviews' },
    { name: 'Aftercare', path: '/aftercare', hash: '#aftercare' },
    { name: 'Blogs', path: '/blog', hash: '#blog' },
    { name: 'Calendar', path: '/calendar', hash: '#booking' },
    { name: 'About', path: '/about', hash: '#about' },
    { name: 'Contact', path: '/contact', hash: '#contact' },
  ];

  const handleNavClick = (link) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/' && link.hash) {
      const el = document.querySelector(link.hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate(link.path);
  };

  const hasCustomAvatar = Boolean(
    user?.avatar &&
    !user.avatar.includes('images.unsplash.com') &&
    !user.avatar.includes('ui-avatars.com') &&
    user.avatar.trim() !== ''
  );

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-xl shadow-2xl border-b border-amber-500/20' : 'bg-studio-darker/90 backdrop-blur-md border-b border-white/5'}`}>
      {/* Top Header Bar */}
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-amber-500/30 via-studio-darker to-black p-0.5 border border-amber-500/50 shadow-md group-hover:border-amber-400 group-hover:scale-105 transition-all">
            <img src="/logo.png" alt="Land of God Tattoo Studio Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-base md:text-lg tracking-[0.16em] text-studio-textMain uppercase leading-tight">
              LAND OF <span className="text-amber-400">GOD</span>
            </span>
            <span className="text-[8.5px] tracking-[0.22em] text-studio-bronzeLight uppercase font-bold">
              TATTOO STUDIO • UNA
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1.5 2xl:gap-3">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (location.pathname === '/' && location.hash === link.hash);
            const isContact = link.name === 'Contact';

            return (
              <button
                key={link.name}
                onClick={() => handleNavClick(link)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[13px] font-semibold tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'text-amber-400 bg-amber-400/10 font-bold shadow-[0_0_10px_rgba(245,158,11,0.15)] border border-amber-400/30'
                    : isContact
                    ? 'text-studio-textMuted hover:text-amber-300 hover:bg-white/5 border border-white/10'
                    : 'text-studio-textMuted hover:text-studio-textMain hover:bg-white/5'
                }`}
              >
                {link.name}
              </button>
            );
          })}
        </nav>

        {/* Right CTA & Profile / Admin actions */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`h-9 px-3.5 rounded-full flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  isAdmin
                    ? 'text-amber-300 bg-gradient-to-r from-amber-950/60 to-black border border-amber-500/50 hover:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                    : 'text-studio-textMain bg-studio-card/80 border border-white/10 hover:bg-studio-card'
                }`}
              >
                {hasCustomAvatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-5 h-5 rounded-full object-cover border border-amber-400"
                  />
                ) : isAdmin ? (
                  <div className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-studio-bronzeLight">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                )}
                <span className="truncate max-w-[100px]">
                  {isAdmin ? 'ADMIN' : user.name.split(' ')[0]}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-56 bg-studio-secondary/95 backdrop-blur-xl border border-amber-500/20 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2.5 border-b border-white/10 text-xs text-studio-textMuted">
                    Signed in as <p className="font-semibold text-studio-textMain truncate mt-0.5">{user.email}</p>
                  </div>
                  {isAdmin ? (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-amber-400 hover:bg-amber-400/10 hover:text-amber-300 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Admin Portal</span>
                    </Link>
                  ) : (
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-studio-textMain hover:bg-white/5"
                    >
                      <UserIcon className="w-4 h-4 text-studio-bronzeLight" />
                      <span>My Profile & Inks</span>
                    </Link>
                  )}
                  <div className="border-t border-white/10 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-950/20 text-left transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="h-9 px-3 rounded-full flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-studio-textMuted hover:text-amber-400 hover:bg-white/5 border border-white/10 transition-colors"
              title="Studio Administrator & Staff Portal"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400/80" />
              <span>Staff Admin</span>
            </Link>
          )}

          {/* Direct WhatsApp Action */}
          <a
            href="https://wa.me/917807966080"
            target="_blank"
            rel="noreferrer"
            className="h-9 px-3.5 rounded-full flex items-center gap-2 text-xs font-bold tracking-wide text-emerald-400 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 hover:border-emerald-400 shadow-sm transition-all"
          >
            <span className="text-sm leading-none">💬</span>
            <span>7807966080</span>
          </a>

          {/* BOOK NOW Primary CTA */}
          <Link
            to="/booking"
            className="h-9 px-5 rounded-full flex items-center justify-center text-xs font-black uppercase tracking-[0.14em] text-black bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.35)] transition-all duration-300 transform hover:scale-[1.03] active:scale-95"
          >
            BOOK NOW
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="xl:hidden flex items-center space-x-2">
          <a
            href="https://wa.me/917807966080"
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 px-2.5 py-1.5 text-[11px] font-bold uppercase rounded flex items-center space-x-1"
          >
            <span>💬 WhatsApp</span>
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded text-studio-textMain hover:text-studio-bronzeLight bg-studio-card/80 border border-studio-border"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-studio-secondary/95 backdrop-blur-xl border-b border-studio-border px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-3 pb-4 border-b border-studio-border/50">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link)}
                className="text-left text-sm py-2 px-3 rounded hover:bg-studio-card text-studio-textMuted hover:text-studio-bronzeLight transition-colors font-medium"
              >
                {link.name}
              </button>
            ))}
            <button
              onClick={() => handleNavClick({ name: 'Contact', path: '/contact', hash: '#contact' })}
              className="text-left text-sm py-2 px-3 rounded bg-studio-gold/10 text-studio-gold font-bold border border-studio-gold/30 hover:bg-studio-gold/20 transition-colors"
            >
              Contact Us
            </button>
          </div>

          <div className="pt-2 flex flex-col space-y-3">
            {user ? (
              <>
                {isAdmin ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-sm text-amber-400 font-bold py-2 px-3 rounded bg-amber-950/30 border border-amber-500/40"
                  >
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>Admin Portal</span>
                  </Link>
                ) : (
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-sm text-studio-textMain py-2"
                  >
                    <UserIcon className="w-4 h-4 text-studio-bronzeLight" />
                    <span>Profile ({user.name})</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center space-x-2 text-sm text-red-400 py-2 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center bg-studio-card border border-studio-border py-2 text-sm font-semibold uppercase tracking-wider text-studio-bronzeLight"
              >
                Customer Sign In / Register
              </Link>
            )}

            <Link
              to="/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center bg-gradient-to-r from-studio-bronze to-studio-bronzeDark text-studio-darker font-bold py-3 uppercase tracking-widest text-xs shadow-bronze"
            >
              Book Studio Appointment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
