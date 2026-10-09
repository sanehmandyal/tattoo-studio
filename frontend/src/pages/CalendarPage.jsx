import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { availabilityAPI } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { Calendar as CalendarIcon, Clock, Check, Sparkles, MessageSquare, ChevronLeft, ChevronRight, ShieldCheck, MapPin } from 'lucide-react';
import { format, addDays, isSameDay, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { createBookingInquiryUrl } from '../utils/whatsapp';

export const CalendarPage = () => {
  const { settings } = useSettings();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState('02:00 PM');
  const [selectedStyle, setSelectedStyle] = useState('Mahadev Sacred Geometry');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const phone = settings?.phone || '+91 78079 66080';
  const whatsappNumber = (settings?.whatsapp || '917807966080').replace(/[^0-9]/g, '');
  const studioName = settings?.studioName || 'Land of God Tattoo Studio';
  const street = settings?.address?.street || 'Friends Colony';
  const city = settings?.address?.city || 'Una';

  const defaultSlots = [
    '11:00 AM',
    '12:30 PM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
    '06:30 PM',
    '07:30 PM'
  ];

  const daysInWeek = Array.from({ length: 7 }).map((_, i) => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
    return addDays(start, i);
  });

  const handleWhatsAppBooking = () => {
    const formattedDate = format(selectedDate, 'EEEE, MMMM do, yyyy');
    const message = `🔱 *${studioName.toUpperCase()} — CALENDAR RESERVATION*\n━━━━━━━━━━━━━━━━━━━━\n📍 *Studio:* ${street}, ${city}\n🎨 *Preferred Style:* ${selectedStyle}\n📅 *Date:* ${formattedDate}\n⏰ *Time Slot:* ${selectedSlot}\n\nPlease confirm appointment availability. Thank you!`;
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-studio-bg">
      <Helmet>
        <title>Studio Calendar &amp; Live Availability — LAND OF GOD TATTOO STUDIO (Una, HP)</title>
        <meta
          name="description"
          content="View Master Sunil's open tattoo session availability calendar in Friends Colony, Una, HP. Select your preferred date and time slot for direct WhatsApp confirmation."
        />
        <meta name="keywords" content="Tattoo Appointment Calendar Una, Tattoo Artist Availability Himachal, Land of God Booking Schedule" />
      </Helmet>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-studio-gold font-serif">
            🔱 LIVE ATELIER AVAILABILITY 🔱
          </span>
          <h1 className="ancient-carved-heading text-4xl sm:text-5xl uppercase tracking-tight text-studio-textMain">
            ॥ STUDIO BOOKING CALENDAR ॥
          </h1>
          <p className="text-xs sm:text-sm text-studio-textMuted font-serif">
            Check open appointment slots with Master Sunil at Land of God Tattoo Studio, Friends Colony, Una (HP).
          </p>
        </div>

        {/* Calendar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left / Center: Interactive Week Calendar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel-dark p-6 sm:p-8 rounded-2xl border border-studio-bronze/50 shadow-2xl space-y-6">
              
              {/* Week Navigation */}
              <div className="flex items-center justify-between border-b border-studio-border/50 pb-4">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5 text-studio-gold" />
                  <h3 className="font-display font-bold text-base sm:text-lg text-studio-textMain">
                    {format(daysInWeek[0], 'MMMM yyyy')}
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                    className="p-2 rounded-lg bg-studio-card border border-studio-border/50 text-studio-textMuted hover:text-studio-gold transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                    className="p-2 rounded-lg bg-studio-card border border-studio-border/50 text-studio-textMuted hover:text-studio-gold transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 sm:gap-3">
                {daysInWeek.map((day, idx) => {
                  const isSelected = isSameDay(day, selectedDate);
                  const isToday = isSameDay(day, new Date());
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(day)}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-1 ${
                        isSelected
                          ? 'bg-gradient-to-b from-studio-bronze to-amber-900/80 border-studio-gold text-white shadow-lg'
                          : 'bg-studio-card/80 border-studio-border/40 text-studio-textMuted hover:border-studio-bronze/60 hover:text-studio-textMain'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {format(day, 'EEE')}
                      </span>
                      <span className={`text-lg font-black font-display ${isSelected ? 'text-white' : 'text-studio-textMain'}`}>
                        {format(day, 'd')}
                      </span>
                      {isToday && (
                        <span className="text-[9px] text-emerald-400 font-bold tracking-tight">Today</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Time Slots Matrix */}
              <div className="pt-4 border-t border-studio-border/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-studio-bronzeLight font-display flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-studio-gold" />
                    <span>Available Time Slots for {format(selectedDate, 'EEE, MMM d')}</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Slots Open</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {defaultSlots.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 px-3 rounded-lg border text-xs font-bold font-mono transition-all flex items-center justify-center space-x-1.5 ${
                          isSelected
                            ? 'bg-studio-gold text-black border-studio-gold shadow-md font-black'
                            : 'bg-studio-secondary border-studio-border/50 text-studio-textMain hover:border-studio-gold/60'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{slot}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Studio Health & Safety Guarantee */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="ancient-stone-card p-4 rounded-xl flex items-center space-x-3 text-xs">
                <ShieldCheck className="w-6 h-6 text-studio-gold shrink-0" />
                <span>100% Single-use needle cartridges</span>
              </div>
              <div className="ancient-stone-card p-4 rounded-xl flex items-center space-x-3 text-xs">
                <Sparkles className="w-6 h-6 text-studio-gold shrink-0" />
                <span>Hand-drawn custom stencils</span>
              </div>
              <div className="ancient-stone-card p-4 rounded-xl flex items-center space-x-3 text-xs">
                <MapPin className="w-6 h-6 text-studio-gold shrink-0" />
                <span>{street}, {city}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Appointment Reservation Card */}
          <div className="space-y-6">
            <div className="glass-panel-dark p-6 rounded-2xl border border-studio-gold/60 shadow-2xl space-y-6 sticky top-28">
              <div className="border-b border-studio-border/50 pb-4">
                <span className="text-[10px] font-bold text-studio-bronzeLight uppercase tracking-widest font-serif">
                  ॥ DIRECT CONFIRMATION ॥
                </span>
                <h3 className="ancient-carved-heading text-xl uppercase font-black text-studio-textMain mt-1">
                  Selected Reservation
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-studio-border/30">
                  <span className="text-studio-textMuted">Date:</span>
                  <span className="font-bold text-studio-textMain">{format(selectedDate, 'EEEE, MMM do, yyyy')}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-studio-border/30">
                  <span className="text-studio-textMuted">Time Slot:</span>
                  <span className="font-bold text-studio-gold font-mono">{selectedSlot}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-studio-border/30">
                  <span className="text-studio-textMuted">Lead Artist:</span>
                  <span className="font-bold text-studio-textMain">Master Sunil ({city})</span>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-bold text-studio-textMuted uppercase font-display">
                    Preferred Tattoo Style
                  </label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none focus:border-studio-gold"
                  >
                    <option value="Mahadev Sacred Geometry">Mahadev Sacred Geometry &amp; Trishul</option>
                    <option value="Fine Line & Sanskrit Mantra">Fine Line &amp; Sanskrit Mantra</option>
                    <option value="Photorealistic Portrait">Photorealistic Portrait Realism</option>
                    <option value="Devbhoomi Mandala & Lotus">Devbhoomi Mandala &amp; Lotus</option>
                    <option value="Heavy Blackwork">Heavy Blackwork &amp; Neo-Traditional</option>
                    <option value="Custom Cover-up">Custom Cover-Up &amp; Redesign</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-studio-border/50 space-y-3">
                <button
                  type="button"
                  onClick={handleWhatsAppBooking}
                  className="w-full bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/60 hover:border-emerald-400 text-emerald-300 font-bold py-3.5 px-4 text-xs tracking-wider uppercase text-center rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Reserve via WhatsApp ({phone})</span>
                </button>

                <Link
                  to="/booking"
                  className="w-full bg-studio-card hover:bg-studio-secondary border border-studio-border text-studio-textMuted hover:text-white py-2.5 text-xs font-bold uppercase tracking-wider text-center block rounded-xl transition-all"
                >
                  Or Fill Studio Booking Form
                </Link>
              </div>

              <p className="text-[10px] text-center text-studio-textMuted/70 font-serif">
                No upfront payment required for WhatsApp consultations. Walk-ins welcome based on daily queue.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
