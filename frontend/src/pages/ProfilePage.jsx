import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import { Calendar, Clock, User, Phone, Mail, Sparkles, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyBookings = async () => {
      try {
        const res = await bookingsAPI.getMyBookings();
        if (res.success) {
          setMyBookings(res.bookings);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-studio-bg lg:pl-12">
      <Helmet>
        <title>{user.name}'s Studio Dashboard — INK CARVERS</title>
      </Helmet>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* User Card Header */}
        <div className="glass-panel-dark p-6 sm:p-8 rounded-2xl border border-studio-border/60 mb-10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-studio-bronze shadow-bronze"
            />
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-studio-bronzeLight bg-studio-card px-2 py-0.5 rounded border border-studio-border/30">
                Studio Client
              </span>
              <h1 className="font-condensed font-black text-3xl text-studio-textMain uppercase mt-1">
                {user.name}
              </h1>
              <p className="text-xs text-studio-textMuted">{user.email} • {user.phone || 'No phone recorded'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/booking"
              className="bg-studio-bronze hover:bg-studio-bronzeLight text-studio-darker font-condensed font-bold px-5 py-2.5 text-xs uppercase tracking-wider rounded shadow-bronze"
            >
              Book New Tattoo
            </Link>
            <button
              onClick={logout}
              className="border border-studio-border hover:border-red-400 text-studio-textMuted hover:text-red-400 px-4 py-2.5 text-xs font-semibold rounded"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* My Appointments List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-studio-border/30 pb-3">
            <h2 className="font-condensed font-black text-2xl uppercase tracking-wider text-studio-textMain">
              My Tattoo Appointments ({myBookings.length})
            </h2>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-studio-textMuted">
              Loading appointments...
            </div>
          ) : myBookings.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-xl border border-studio-border/40 space-y-4">
              <Calendar className="w-12 h-12 text-studio-bronze/40 mx-auto" />
              <h3 className="text-lg font-bold text-studio-textMain">No appointments booked yet</h3>
              <p className="text-xs text-studio-textMuted max-w-sm mx-auto">
                Ready to transform your canvas? Explore our 3D placement lab or book directly with a master artist.
              </p>
              <Link
                to="/booking"
                className="inline-block bg-studio-bronze hover:bg-studio-bronzeLight text-studio-darker font-bold px-6 py-2.5 text-xs uppercase tracking-widest rounded shadow-bronze"
              >
                Schedule First Appointment
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myBookings.map((b) => {
                const isConfirmed = b.status === 'confirmed';
                const isPending = b.status === 'pending';
                const isCompleted = b.status === 'completed';

                return (
                  <div
                    key={b._id}
                    className="glass-card p-6 rounded-xl border border-studio-border/50 shadow-xl space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-studio-border/30 pb-3 mb-3">
                        <span className="font-mono text-xs font-bold text-studio-bronzeLight">
                          Ref: {b.bookingRef}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                            isConfirmed
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : isPending
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              : isCompleted
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              : 'bg-red-500/10 text-red-400 border-red-500/30'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      <h3 className="font-condensed font-black text-xl text-studio-textMain uppercase">
                        {b.tattooStyle} Tattoo — {b.bodyPlacement}
                      </h3>
                      <p className="text-xs text-studio-bronzeLight mt-0.5">
                        Concept: {b.selectedDesign || 'Custom Piece'}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-studio-textMuted bg-studio-secondary/60 p-3 rounded border border-studio-border/20">
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-studio-textMuted/70">Date:</span>
                          <span className="font-semibold text-studio-textMain">{b.preferredDate}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-studio-textMuted/70">Time:</span>
                          <span className="font-semibold text-studio-textMain">{b.preferredTimeSlot}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-studio-textMuted/70">Artist:</span>
                          <span className="font-semibold text-studio-textMain">{b.artist?.name || 'Resident'}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-studio-textMuted/70">Size:</span>
                          <span className="font-semibold text-studio-textMain">{b.approximateSize}</span>
                        </div>
                      </div>

                      {b.additionalNotes && (
                        <p className="text-xs text-studio-textMuted/80 italic mt-3">
                          "{b.additionalNotes}"
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-studio-border/30 text-xs text-studio-textMuted flex items-center justify-between">
                      <span>Submitted: {new Date(b.createdAt).toLocaleDateString()}</span>
                      <Link to="/contact" className="text-studio-bronzeLight hover:underline font-semibold">
                        Need Changes? Contact Studio
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
