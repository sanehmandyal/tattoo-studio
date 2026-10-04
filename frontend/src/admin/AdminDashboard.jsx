import React, { useState, useEffect } from 'react';
import { bookingsAPI } from '../services/api';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  Clock,
  CheckCircle,
  Users,
  Image,
  BookOpen,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await bookingsAPI.getStats();
        if (res.success) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleQuickApprove = async (bookingId) => {
    try {
      const res = await bookingsAPI.updateStatus(bookingId, {
        status: 'confirmed',
        note: 'Quick-approved by studio director',
      });
      if (res.success) {
        toast.success('Appointment confirmed and client notified!');
        // Reload stats
        const refreshed = await bookingsAPI.getStats();
        if (refreshed.success) setStats(refreshed.stats);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update booking');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-studio-textMuted">
        Loading studio analytics...
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Appointments',
      value: stats?.totalBookings || 0,
      icon: CalendarCheck,
      color: 'text-studio-bronze',
      bg: 'bg-studio-bronze/10',
    },
    {
      title: 'Pending Approvals',
      value: stats?.pendingBookings || 0,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      title: 'Confirmed Sessions',
      value: stats?.confirmedBookings || 0,
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'New Inquiries',
      value: stats?.newInquiries || 0,
      icon: MessageSquare,
      color: 'text-studio-glowCyan',
      bg: 'bg-studio-glowCyan/10',
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-studio-border/30 pb-4">
        <div>
          <h1 className="font-condensed font-black text-3xl uppercase tracking-wider text-studio-textMain">
            Executive Studio Dashboard
          </h1>
          <p className="text-xs text-studio-textMuted">
            Real-time appointment metrics, booking queue, and master database summary.
          </p>
        </div>
        <Link
          to="/admin/bookings"
          className="bg-studio-bronze hover:bg-studio-bronzeLight text-white font-condensed font-bold px-4 py-2 text-xs uppercase tracking-wider rounded shadow-bronze"
        >
          Manage All Appointments
        </Link>
      </div>

      {/* 4 Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="glass-card p-5 rounded-xl border border-studio-border/50 shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-studio-textMuted uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="font-condensed font-black text-3xl text-studio-textMain">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Status Breakdown & Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Recent Appointment Queue */}
        <div className="lg:col-span-8 glass-panel-dark p-6 rounded-xl border border-studio-border/50 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-studio-border/30 pb-3">
            <h2 className="font-condensed font-bold text-lg text-studio-textMain uppercase tracking-wide">
              Recent Booking Submissions
            </h2>
            <Link to="/admin/bookings" className="text-xs font-bold text-studio-bronzeLight hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recentBookings?.length === 0 ? (
              <p className="text-xs text-studio-textMuted py-4">No recent bookings in queue.</p>
            ) : (
              stats?.recentBookings?.map((b) => (
                <div
                  key={b._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg bg-studio-secondary/60 border border-studio-border/30 gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-studio-bronzeLight">{b.bookingRef}</span>
                      <span className="text-xs font-bold text-studio-textMain">{b.customerName}</span>
                      <span
                        className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : b.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-studio-card text-studio-textMuted border-studio-border'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-studio-textMuted">
                      {b.tattooStyle} ({b.bodyPlacement}) • Artist: <strong className="text-studio-textMain">{b.artist?.name || 'Resident'}</strong> • Date: <strong>{b.preferredDate} ({b.preferredTimeSlot})</strong>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {b.status === 'pending' && (
                      <button
                        onClick={() => handleQuickApprove(b._id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-1.5 rounded transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    <Link
                      to={`/admin/bookings?search=${b.bookingRef}`}
                      className="border border-studio-border hover:border-studio-bronze text-studio-textMuted hover:text-studio-textMain text-[11px] px-3 py-1.5 rounded"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Status Distribution Breakdown */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-xl border border-studio-border/50 shadow-xl space-y-4">
          <h2 className="font-condensed font-bold text-lg text-studio-textMain uppercase tracking-wide border-b border-studio-border/30 pb-3">
            Appointment Distribution
          </h2>

          <div className="space-y-3">
            {stats?.statusDistribution?.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-studio-textMuted">{item.name}</span>
                  <span className="text-studio-textMain font-bold">{item.value}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-studio-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, stats.totalBookings > 0 ? (item.value / stats.totalBookings) * 100 : 0)}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-studio-border/30 grid grid-cols-2 gap-3 text-center">
            <div className="bg-studio-card p-2 rounded border border-studio-border/20">
              <span className="text-[10px] uppercase font-bold text-studio-textMuted">3D Flash Motifs</span>
              <p className="font-condensed font-bold text-lg text-studio-textMain">{stats?.totalDesigns || stats?.totalArtists || 12}</p>
            </div>
            <div className="bg-studio-card p-2 rounded border border-studio-border/20">
              <span className="text-[10px] uppercase font-bold text-studio-textMuted">Portfolio Pieces</span>
              <p className="font-condensed font-bold text-lg text-studio-textMain">{stats?.totalPortfolio || 0}</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
