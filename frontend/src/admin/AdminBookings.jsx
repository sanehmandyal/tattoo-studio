import React, { useState, useEffect } from 'react';
import { bookingsAPI, artistsAPI } from '../services/api';
import { Search, Filter, CheckCircle, XCircle, Clock, Calendar, RefreshCw, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [artists, setArtists] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [artistFilter, setArtistFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Reschedule Modal State
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('02:00 PM');
  const [rescheduleReason, setRescheduleReason] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (artistFilter !== 'All') params.artist = artistFilter;
      if (search) params.search = search;

      const [bRes, aRes] = await Promise.all([
        bookingsAPI.getAll(params),
        artistsAPI.getAll(true)
      ]);

      if (bRes.success) setBookings(bRes.bookings);
      if (aRes.success) setArtists(aRes.artists);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, artistFilter, search]);

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      const res = await bookingsAPI.updateStatus(bookingId, {
        status,
        note: `Status marked as ${status} by Studio Admin`,
      });
      if (res.success) {
        toast.success(`Booking status changed to ${status}`);
        loadData();
      }
    } catch (err) {
      toast.error(err.message || 'Status update failed');
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!newDate || !newTime) {
      toast.error('Please select both new date and time');
      return;
    }
    try {
      const res = await bookingsAPI.reschedule(rescheduleModal._id, {
        preferredDate: newDate,
        preferredTimeSlot: newTime,
        reason: rescheduleReason,
      });
      if (res.success) {
        toast.success('Booking rescheduled and client notified!');
        setRescheduleModal(null);
        loadData();
      }
    } catch (err) {
      toast.error(err.message || 'Rescheduling conflict');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-studio-border/30 pb-4">
        <div>
          <h1 className="font-condensed font-black text-3xl uppercase tracking-wider text-studio-textMain">
            Appointment Management
          </h1>
          <p className="text-xs text-studio-textMuted">
            Review incoming requests, manage double-booking safety, approve, reschedule or complete sessions.
          </p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center space-x-2 border border-studio-border hover:border-studio-bronze text-studio-textMuted hover:text-studio-textMain px-3 py-1.5 rounded text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 rounded-xl border border-studio-border/50 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-studio-textMuted absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ref ID, name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-studio-card border border-studio-border rounded pl-9 pr-3 py-2 text-xs text-studio-textMain focus:outline-none focus:border-studio-bronze"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-studio-card border border-studio-border rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none focus:border-studio-bronze"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Artist Filter */}
        <div>
          <select
            value={artistFilter}
            onChange={(e) => setArtistFilter(e.target.value)}
            className="w-full bg-studio-card border border-studio-border rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none focus:border-studio-bronze"
          >
            <option value="All">All Artists</option>
            {artists.map(a => (
              <option key={a._id} value={a._id}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bookings Table / Cards */}
      {loading ? (
        <div className="py-20 text-center text-xs text-studio-textMuted">
          Loading appointments...
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-xl border border-studio-border/40 text-studio-textMuted text-xs">
          No appointments found matching your filters.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="glass-card p-5 rounded-xl border border-studio-border/50 shadow-xl space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-studio-border/30 pb-3 gap-2">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold text-studio-bronzeLight bg-studio-card px-2.5 py-1 rounded border border-studio-border/40">
                    {b.bookingRef}
                  </span>
                  <span className="font-bold text-sm text-studio-textMain">{b.customerName}</span>
                  <span className="text-xs text-studio-textMuted">({b.customerEmail} • {b.customerPhone})</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      b.status === 'confirmed'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : b.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : b.status === 'completed'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              </div>

              {/* Booking Specifications */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-studio-textMuted bg-studio-secondary/40 p-3 rounded border border-studio-border/20">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-studio-textMuted/70">Tattoo Style &amp; Placement:</span>
                  <span className="font-semibold text-studio-textMain">{b.tattooStyle} ({b.bodyPlacement})</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-studio-textMuted/70">Scheduled Slot:</span>
                  <span className="font-semibold text-studio-bronzeLight">{b.preferredDate} at {b.preferredTimeSlot}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-studio-textMuted/70">Assigned Artist:</span>
                  <span className="font-semibold text-studio-textMain">{b.artist?.name || 'Unassigned'}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-studio-textMuted/70">Size &amp; Budget:</span>
                  <span className="font-semibold text-studio-textMain">{b.approximateSize} ({b.budgetRange})</span>
                </div>
              </div>

              {b.additionalNotes && (
                <p className="text-xs text-studio-textMuted italic bg-studio-card/60 p-2.5 rounded border border-studio-border/30">
                  Client Notes: "{b.additionalNotes}"
                </p>
              )}

              {/* Status Action Controls */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-[11px] text-studio-textMuted">
                  Created: {new Date(b.createdAt).toLocaleString()}
                </div>

                <div className="flex items-center space-x-2">
                  {b.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(b._id, 'confirmed')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded transition-colors"
                    >
                      Approve Booking
                    </button>
                  )}
                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(b._id, 'completed')}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded transition-colors"
                    >
                      Mark Completed
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setRescheduleModal(b);
                      setNewDate(b.preferredDate);
                      setNewTime(b.preferredTimeSlot);
                    }}
                    className="border border-studio-border hover:border-studio-bronze text-studio-bronzeLight px-3 py-1.5 rounded"
                  >
                    Reschedule
                  </button>
                  {b.status !== 'rejected' && b.status !== 'cancelled' && (
                    <button
                      onClick={() => handleUpdateStatus(b._id, 'rejected')}
                      className="border border-red-500/40 text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel-dark p-6 rounded-xl border border-studio-border shadow-2xl space-y-4">
            <h3 className="font-condensed font-bold text-xl text-studio-textMain uppercase">
              Reschedule Appointment ({rescheduleModal.bookingRef})
            </h3>
            <p className="text-xs text-studio-textMuted">
              Change date or time slot for client <strong>{rescheduleModal.customerName}</strong>. An automatic notification will be sent.
            </p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-studio-textMuted uppercase mb-1">New Date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-studio-card border border-studio-border rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none focus:border-studio-bronze"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-studio-textMuted uppercase mb-1">New Time Slot</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-studio-card border border-studio-border rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none focus:border-studio-bronze"
                >
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:30 PM">12:30 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                  <option value="06:30 PM">06:30 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-studio-textMuted uppercase mb-1">Reschedule Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Artist schedule adjustment"
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="w-full bg-studio-card border border-studio-border rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none focus:border-studio-bronze"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setRescheduleModal(null)}
                  className="px-4 py-2 text-xs text-studio-textMuted hover:text-studio-textMain"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-studio-bronze hover:bg-studio-bronzeLight text-studio-darker font-bold px-4 py-2 text-xs uppercase tracking-wider rounded shadow-bronze"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
