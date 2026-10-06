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
    { name: 'Portfolio & Gallery', path: '/portfolio', hash: '#portfolio' },
    { name: '3D Placement', path: '/interactive-3d', hash: '#interactive-3d' },
    { name: 'Reviews', path: '/reviews', hash: '#reviews' },
    { name: 'Aftercare', path: '/aftercare', hash: '#aftercare' },
    { name: 'Blogs', path: '/blog', hash: '#blog' },
    { name: 'Calendar', path: '/calendar', hash: '#booking' },
    { name: 'About', path: '/about', hash: '#about' },
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
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      {/* Top Header Bar */}
      <div className="bg-studio-darker/95 backdrop-blur-md px-4 lg:px-8 py-3 flex items-center justify-between border-b border-studio-border transition-colors">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-studio-bronze/40 to-black/90 flex items-center justify-center p-0.5 shadow-lg shadow-studio-bronze/30 border border-studio-bronze/60 transform group-hover:scale-105 transition-all">
            <img src="/logo.png" alt="Land of God Tattoo Studio Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-lg md:text-xl tracking-[0.18em] text-studio-textMain uppercase leading-tight transition-colors">
              LAND OF <span className="text-studio-bronze">GOD</span>
            </span>
            <span className="text-[9px] tracking-[0.22em] text-studio-bronzeLight font-sans uppercase font-bold">
              TATTOO STUDIO • FRIENDS COLONY, UNA
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center space-x-6 text-sm font-medium tracking-wide">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (location.pathname === '/' && location.hash === link.hash);
            return (
              <button
                key={link.name}
                onClick={() => handleNavClick(link)}
                className={`transition-colors duration-200 py-1 border-b-2 font-semibold ${
                  isActive
                    ? 'text-studio-bronze border-studio-bronze font-bold'
                    : 'text-studio-textMuted hover:text-studio-textMain border-transparent hover:border-studio-bronze/50'
                }`}
              >
                {link.name}
              </button>
            );
          })}
        </nav>

        {/* Right CTA & Profile / Admin actions */}
        <div className="hidden lg:flex items-center space-x-3.5">
          {/* Separated Contact Section Link */}
          <button
            onClick={() => handleNavClick({ name: 'Contact', path: '/contact', hash: '#contact' })}
            className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
              location.pathname === '/contact' || (location.pathname === '/' && location.hash === '#contact')
                ? 'text-studio-gold border-studio-gold/60 bg-studio-gold/10 shadow-sm'
                : 'text-studio-textMuted hover:text-studio-textMain border-studio-border/60 hover:border-studio-bronze/60 bg-studio-card/50'
            }`}
          >
            Contact
          </button>

          <div className="h-4 w-px bg-studio-border/50"></div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded transition-all ${
                  isAdmin
                    ? 'text-amber-400 bg-amber-950/40 border border-amber-500/50 hover:bg-amber-950/70 shadow-sm'
                    : 'text-studio-bronzeLight bg-studio-card/80 border border-studio-border hover:bg-studio-card'
                }`}
              >
                {hasCustomAvatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-5 h-5 rounded-full object-cover border border-amber-400"
                  />
                ) : isAdmin ? (
                  <div className="w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400/80 flex items-center justify-center text-amber-400">
                    <Shield className="w-3 h-3" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-studio-darker border border-studio-border flex items-center justify-center text-studio-bronzeLight">
                    <UserIcon className="w-3 h-3" />
                  </div>
                )}
                <span className="truncate max-w-[100px] font-bold">
                  {isAdmin ? 'Admin' : user.name.split(' ')[0]}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-studio-secondary border border-studio-border rounded-lg shadow-2xl py-2 z-50 backdrop-blur-lg">
                  <div className="px-4 py-2.5 border-b border-studio-border/70 text-xs text-studio-textMuted">
                    Signed in as <p className="font-semibold text-studio-textMain truncate mt-0.5">{user.email}</p>
                  </div>
                  {isAdmin ? (
                    /* Admin Portal Only for Admin User */
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-amber-400 hover:bg-amber-400/10 hover:text-amber-300 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Admin Portal</span>
                    </Link>
                  ) : (
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-studio-textMain hover:bg-studio-card"
                    >
                      <UserIcon className="w-4 h-4 text-studio-bronzeLight" />
                      <span>My Profile & Inks</span>
                    </Link>
                  )}
                  <div className="border-t border-studio-border/50 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-950/20 text-left"
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
              className="flex items-center space-x-1.5 text-xs font-semibold tracking-wider uppercase text-studio-textMuted hover:text-studio-gold transition-colors py-1.5 px-2 rounded hover:bg-studio-secondary/60"
              title="Studio Administrator & Staff Portal"
            >
              <Shield className="w-3.5 h-3.5 text-studio-gold/80" />
              <span>Staff Admin</span>
            </Link>
          )}

          {/* Direct WhatsApp Action */}
          <a
            href="https://wa.me/917807966080"
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 hover:border-emerald-400 text-emerald-400 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <span>💬 7807966080</span>
          </a>

          {/* BOOK NOW Primary CTA */}
          <Link
            to="/booking"
            className="bg-gradient-to-r from-studio-bronze to-amber-700 hover:from-amber-600 hover:to-studio-bronze text-white px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 shadow-md rounded transform hover:scale-[1.02] border border-amber-400/30"
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
