import React, { useState, useEffect } from 'react';
import { bookingsAPI, artistsAPI, availabilityAPI } from '../services/api';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, User, ShieldAlert, Lock } from 'lucide-react';
import { toast } from 'sonner';

export const AdminCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('');
  const [dayBookings, setDayBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Block Modal
  const [blockReason, setBlockReason] = useState('Studio Holiday');

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await artistsAPI.getAll(true);
        if (res.success && res.artists.length > 0) {
          setArtists(res.artists);
          setSelectedArtist(res.artists[0]._id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  useEffect(() => {
    const fetchDayBookings = async () => {
      if (!selectedDate) return;
      try {
        const params = { date: selectedDate };
        if (selectedArtist && selectedArtist !== 'All') params.artist = selectedArtist;
        const res = await bookingsAPI.getAll(params);
        if (res.success) setDayBookings(res.bookings);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDayBookings();
  }, [selectedDate, selectedArtist]);

  const handleBlockDate = async () => {
    try {
      await availabilityAPI.blockDate({
        artistId: selectedArtist && selectedArtist !== 'All' ? selectedArtist : (artists[0]?._id || 'studio-master'),
        date: selectedDate,
        reason: blockReason,
        isBlocked: true,
      });
      toast.success(`Date ${selectedDate} marked as unavailable/blocked for studio`);
    } catch (err) {
      toast.error(err.message || 'Failed to block date');
    }
  };

  const renderDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-10" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isSelected = selectedDate === dateStr;
      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      cells.push(
        <button
          key={d}
          onClick={() => setSelectedDate(dateStr)}
          className={`h-10 w-full rounded-lg flex flex-col items-center justify-center text-xs font-semibold transition-all border ${
            isSelected
              ? 'bg-studio-glowCyan text-studio-darker font-bold border-studio-glowCyan shadow-cyan-glow'
              : isToday
              ? 'border-studio-bronze text-studio-bronzeLight bg-studio-card'
              : 'border-studio-border/30 bg-studio-secondary/60 text-studio-textMain hover:border-studio-bronze/60'
          }`}
        >
          <span>{d}</span>
        </button>
      );
    }
    return cells;
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-studio-border/30 pb-4">
        <div>
          <h1 className="font-condensed font-black text-3xl uppercase tracking-wider text-studio-textMain">
            Studio Master Schedule
          </h1>
          <p className="text-xs text-studio-textMuted">
            Review appointments by calendar date and block custom off-days for resident masters.
          </p>
        </div>

        <div>
          <select
            value={selectedArtist}
            onChange={(e) => setSelectedArtist(e.target.value)}
            className="bg-studio-card border border-studio-border rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none focus:border-studio-bronze"
          >
            <option value="All">All Resident Artists</option>
            {artists.map(a => (
              <option key={a._id} value={a._id}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Calendar Box */}
        <div className="lg:col-span-6 glass-panel-dark p-6 rounded-xl border border-studio-border/50 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-studio-border/30">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4 text-studio-glowCyan" />
              <span className="text-xs font-bold uppercase text-studio-textMain">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                className="p-1 hover:text-studio-textMain"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                className="p-1 hover:text-studio-textMain"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-studio-textMuted uppercase mb-1">
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {renderDays()}
          </div>

          {/* Block Date Tool */}
          <div className="pt-4 border-t border-studio-border/30 flex items-center justify-between gap-3 text-xs">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Block reason (e.g. Guest Spot / Holiday)"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-1.5 text-xs text-studio-textMain"
              />
            </div>
            <button
              onClick={handleBlockDate}
              className="bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/40 px-3 py-1.5 rounded font-bold uppercase text-[11px] shrink-0"
            >
              Block {selectedDate}
            </button>
          </div>
        </div>

        {/* Selected Date Appointments List */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-xl border border-studio-border/50 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-studio-border/30 pb-3">
            <h2 className="font-condensed font-bold text-lg text-studio-textMain uppercase">
              Sessions Scheduled for: {selectedDate}
            </h2>
            <span className="text-xs text-studio-glowCyan font-bold">
              {dayBookings.length} bookings
            </span>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {dayBookings.length === 0 ? (
              <div className="py-16 text-center text-xs text-studio-textMuted space-y-2">
                <Clock className="w-8 h-8 text-studio-border mx-auto" />
                <p>No appointments booked on {selectedDate}.</p>
              </div>
            ) : (
              dayBookings.map((b) => (
                <div
                  key={b._id}
                  className="bg-studio-secondary/80 p-4 rounded-lg border border-studio-border/40 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-studio-textMain">{b.preferredTimeSlot}</span>
                    <span
                      className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-studio-bronzeLight font-bold">{b.customerName}</span>
                    <span className="font-mono text-studio-textMuted">{b.bookingRef}</span>
                  </div>

                  <p className="text-studio-textMuted">
                    {b.tattooStyle} ({b.bodyPlacement}) • Artist: <strong className="text-studio-textMain">{b.artist?.name || 'Resident'}</strong>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
