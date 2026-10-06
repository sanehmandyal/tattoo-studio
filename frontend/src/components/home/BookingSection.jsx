import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookingsAPI, artistsAPI, availabilityAPI } from '../../services/api';
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { createBookingWhatsAppUrl } from '../../utils/whatsapp';

export const BookingSection = () => {
  const [searchParams] = useSearchParams();
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(searchParams.get('style') || 'Realism');
  const [selectedPlacement, setSelectedPlacement] = useState(searchParams.get('placement') || 'Forearm');
  const [selectedSize, setSelectedSize] = useState('Medium (3-5 inches)');
  const [selectedDesignName, setSelectedDesignName] = useState(searchParams.get('design') || '');

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });

  // Time Slots
  const [availableSlots, setAvailableSlots] = useState([
    { time: '11:00 AM', available: true },
    { time: '12:30 PM', available: true },
    { time: '02:00 PM', available: true },
    { time: '03:30 PM', available: true },
    { time: '05:00 PM', available: true },
    { time: '06:30 PM', available: true },
  ]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('02:00 PM');

  // Customer Details Form
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Load artists
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await artistsAPI.getAll();
        if (res.success && res.artists?.length > 0) {
          setArtists(res.artists);
          const initialArtistId = searchParams.get('artistId') || res.artists[0]._id;
          setSelectedArtist(initialArtistId);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchArtists();
  }, [searchParams]);

  // Check slots when artist or date changes
  useEffect(() => {
    const checkSlots = async () => {
      if (!selectedArtist || !selectedDate) return;
      try {
        const res = await availabilityAPI.getSlots(selectedArtist, selectedDate);
        if (res.success && res.slots) {
          setAvailableSlots(res.slots);
          const firstAvail = res.slots.find(s => s.available);
          if (firstAvail) setSelectedTimeSlot(firstAvail.time);
        }
      } catch (err) {
        // Fallback standard slots
      }
    };
    checkSlots();
  }, [selectedArtist, selectedDate]);

  // Calendar days builder
  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isSelected = selectedDate === dateStr;
      const isToday = new Date().toISOString().split('T')[0] === dateStr;
      const isPast = new Date(dateStr) < new Date(new Date().setHours(0,0,0,0));

      days.push(
        <button
          key={d}
          type="button"
          disabled={isPast}
          onClick={() => setSelectedDate(dateStr)}
          className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
            isSelected
              ? 'bg-studio-glowCyan text-studio-darker font-black shadow-cyan-glow scale-110'
              : isToday
              ? 'border border-studio-bronze text-studio-bronzeLight'
              : isPast
              ? 'text-studio-textMuted/30 cursor-not-allowed'
              : 'text-studio-textMain hover:bg-studio-card hover:text-studio-glowCyan'
          }`}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !selectedArtist || !selectedDate || !selectedTimeSlot) {
      toast.error('Please complete all required fields including preferred time slot');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerName,
        customerEmail,
        customerPhone,
        artist: selectedArtist,
        tattooStyle: selectedStyle,
        bodyPlacement: selectedPlacement,
        approximateSize: selectedSize,
        selectedDesign: selectedDesignName || 'Custom Concept',
        preferredDate: selectedDate,
        preferredTimeSlot: selectedTimeSlot,
        additionalNotes: notes,
      };

      const res = await bookingsAPI.create(payload);
      if (res.success) {
        setBookingSuccess(res.booking);
        toast.success('Appointment request submitted successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Booking conflict. Please choose another date or time.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-20 bg-studio-bg relative border-t border-b border-white/5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header */}
        <div className="mb-10 border-b border-white/10 pb-4 text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Online Scheduling
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Book an Appointment
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Reserve your session with Master Sunil &amp; resident artists in Friends Colony, Una
          </p>
        </div>

        {bookingSuccess ? (
          /* Confirmation State */
          <div className="max-w-2xl mx-auto glass-panel-dark p-8 rounded-xl border border-studio-bronze shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-studio-bronze/20 text-studio-glowCyan rounded-full mx-auto flex items-center justify-center border border-studio-glowCyan/50">
              <CheckCircle2 className="w-10 h-10 text-studio-glowCyan" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-studio-bronzeLight font-bold">Request Received</span>
              <h3 className="font-condensed font-black text-3xl text-studio-textMain uppercase mt-1">
                Booking Reference: {bookingSuccess.bookingRef}
              </h3>
              <p className="text-xs text-studio-textMuted mt-2 max-w-md mx-auto">
                Thank you, <strong>{bookingSuccess.customerName}</strong>! Our studio director and artist have received your session requirements for <strong>{bookingSuccess.preferredDate}</strong> at <strong>{bookingSuccess.preferredTimeSlot}</strong>.
              </p>
            </div>

            <div className="bg-studio-card/80 p-4 rounded-lg border border-studio-border/40 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-studio-border/30 pb-1.5">
                <span className="text-studio-textMuted">Style &amp; Placement:</span>
                <span className="text-studio-textMain font-bold">{bookingSuccess.tattooStyle} ({bookingSuccess.bodyPlacement})</span>
              </div>
              <div className="flex justify-between border-b border-studio-border/30 pb-1.5">
                <span className="text-studio-textMuted">Assigned Master Artist:</span>
                <span className="text-studio-bronzeLight font-bold">{bookingSuccess.artist?.name || 'Resident Artist'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-studio-textMuted">Notification Dispatched:</span>
                <span className="text-studio-glowCyan font-medium">{bookingSuccess.customerEmail}</span>
              </div>
            </div>

            <button
              onClick={() => setBookingSuccess(null)}
              className="bg-studio-bronze hover:bg-studio-bronzeLight text-studio-darker font-bold py-2.5 px-6 text-xs uppercase tracking-widest rounded shadow-bronze"
            >
              Book Another Session
            </button>
          </div>
        ) : (
          /* Main Booking Form Grid */
          <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: INTERACTIVE CALENDAR WIDGET (Matches Reference UI Section 5 Left Box) */}
            <div className="lg:col-span-5 glass-panel-dark p-6 rounded-xl border border-studio-border/60 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-studio-border/40">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4 text-studio-glowCyan" />
                  <span className="text-xs font-bold uppercase tracking-wider text-studio-textMain">
                    Select Appointment Date
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-studio-textMuted">
                  <button
                    type="button"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                    className="p-1 hover:text-studio-textMain"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-studio-bronzeLight min-w-[90px] text-center">
                    {currentMonth.toLocaleString('default', { month: 'short', year: 'numeric' })}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                    className="p-1 hover:text-studio-textMain"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-studio-textMuted uppercase">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>

              {/* Day Cells */}
              <div className="grid grid-cols-7 gap-1 text-center py-2">
                {renderCalendarDays()}
              </div>

              {/* Live Available Time Slots */}
              <div className="pt-3 border-t border-studio-border/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-studio-textMuted block mb-2">
                  Available Daily Time Slots ({selectedDate}):
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedTimeSlot(slot.time)}
                      className={`py-1.5 px-2 rounded text-[11px] font-semibold transition-all border ${
                        !slot.available
                          ? 'bg-studio-card/30 text-studio-textMuted/40 border-studio-border/20 line-through cursor-not-allowed'
                          : selectedTimeSlot === slot.time
                          ? 'bg-studio-glowCyan text-studio-darker border-studio-glowCyan font-bold shadow-cyan-glow'
                          : 'bg-studio-card text-studio-textMain border-studio-border hover:border-studio-glowCyan/60'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: SERVICE, ARTIST & CLIENT DETAILS (Matches Reference UI Section 5 Right Side) */}
            <div className="lg:col-span-7 glass-card p-6 rounded-xl border border-studio-border/60 shadow-2xl space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Service Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-studio-textMuted mb-1.5">
                    Service / Tattoo Style
                  </label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full bg-studio-card border border-studio-border focus:border-studio-bronze rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none"
                  >
                    <option value="Realism">Photographic Realism</option>
                    <option value="Fine Line">Micro-Needle Fine Line</option>
                    <option value="Geometric">Sacred Geometry &amp; Mandala</option>
                    <option value="Blackwork">Dark Blackwork &amp; Neo-Traditional</option>
                    <option value="Watercolor">Chromatic Watercolor</option>
                    <option value="Japanese">Japanese Traditional Irezumi</option>
                    <option value="Custom">Custom Mixed Concept</option>
                  </select>
                </div>

                {/* Artist Choice */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-studio-textMuted mb-1.5">
                    Artist Choice
                  </label>
                  <select
                    value={selectedArtist}
                    onChange={(e) => setSelectedArtist(e.target.value)}
                    className="w-full bg-studio-card border border-studio-border focus:border-studio-bronze rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none"
                    required
                  >
                    {artists.map((artist) => (
                      <option key={artist._id} value={artist._id}>
                        {artist.name} ({artist.specializations?.[0] || 'Master'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Body Placement */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-studio-textMuted mb-1.5">
                    Body Placement
                  </label>
                  <select
                    value={selectedPlacement}
                    onChange={(e) => setSelectedPlacement(e.target.value)}
                    className="w-full bg-studio-card border border-studio-border focus:border-studio-bronze rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none"
                  >
                    <option value="Forearm">Forearm</option>
                    <option value="Upper Arm">Upper Arm / Bicep</option>
                    <option value="Chest">Chest &amp; Sternum</option>
                    <option value="Back">Full Back / Upper Back</option>
                    <option value="Shoulder">Shoulder Blade</option>
                    <option value="Wrist">Wrist / Hand</option>
                    <option value="Thigh">Thigh</option>
                    <option value="Calf">Calf / Shin</option>
                    <option value="Ankle">Ankle</option>
                    <option value="Ribs">Ribs &amp; Flank</option>
                  </select>
                </div>

                {/* Tattoo Size */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-studio-textMuted mb-1.5">
                    Approximate Size
                  </label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full bg-studio-card border border-studio-border focus:border-studio-bronze rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none"
                  >
                    <option value="Small (< 2 inches)">Small (&lt; 2 inches)</option>
                    <option value="Medium (3-5 inches)">Medium (3-5 inches)</option>
                    <option value="Large (6-9 inches)">Large (6-9 inches)</option>
                    <option value="Full Sleeve / Backpiece (10+ inches)">Full Sleeve / Backpiece (10+ inches)</option>
                    <option value="Custom Dimension">Custom Dimension</option>
                  </select>
                </div>
              </div>

              {/* Client Contact Info */}
              <div className="pt-2 border-t border-studio-border/30 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-studio-textMuted mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-studio-secondary border border-studio-border focus:border-studio-bronze rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-studio-textMuted mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-studio-secondary border border-studio-border focus:border-studio-bronze rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-studio-textMuted mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-studio-secondary border border-studio-border focus:border-studio-bronze rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none"
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-[11px] font-semibold text-studio-textMuted mb-1">
                  Design Vision &amp; Special Instructions (optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="Describe your tattoo idea, symbolism, or reference details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-studio-secondary border border-studio-border focus:border-studio-bronze rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none"
                />
              </div>

              {/* Submit CTA Buttons */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-studio-bronze to-amber-700 hover:from-amber-600 hover:to-studio-bronze text-white font-display font-bold py-3.5 px-6 text-xs uppercase tracking-[0.2em] rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-50 border border-amber-400/30"
                >
                  {submitting ? 'Submitting Studio Request...' : 'Schedule Online Slot'}
                </button>

                {/* Instant WhatsApp Booking Button */}
                <button
                  type="button"
                  onClick={() => {
                    const artistObj = artists.find(a => a._id === selectedArtist);
                    const waUrl = createBookingWhatsAppUrl({
                      name: customerName,
                      phone: customerPhone,
                      artist: artistObj?.name || 'Master Sunil (Una)',
                      style: selectedStyle,
                      design: selectedDesignName || 'Custom Concept',
                      placement: selectedPlacement,
                      size: selectedSize,
                      date: selectedDate,
                      time: selectedTimeSlot,
                      notes: notes
                    });
                    window.open(waUrl, '_blank');
                    toast.success('Opening WhatsApp with your booking details!');
                  }}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-display font-bold py-3.5 px-6 text-xs uppercase tracking-[0.2em] rounded-lg shadow-lg shadow-emerald-950/50 transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center space-x-2 border border-emerald-300/40"
                >
                  <span>💬 Instant WhatsApp Book</span>
                </button>
              </div>

            </div>

          </form>
        )}

      </div>
    </section>
  );
};
