import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BookingSection } from '../components/home/BookingSection';
import { ShieldCheck, Sparkles, Clock, Calendar } from 'lucide-react';

export const BookingPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-studio-bg lg:pl-12">
      <Helmet>
        <title>Reserve Studio Appointment — LAND OF GOD TATTOO STUDIO (Una, HP)</title>
        <meta
          name="description"
          content="Reserve your sacred tattoo appointment at Land of God Tattoo Studio in Friends Colony, Una, Himachal Pradesh. Master Sunil, direct WhatsApp booking (+91 78079 66080)."
        />
      </Helmet>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-studio-gold font-serif">
            🔱 DEVBHOOMI ATELIER APPOINTMENTS 🔱
          </span>
          <h1 className="ancient-carved-heading text-3xl sm:text-5xl uppercase tracking-wider text-studio-textMain">
            ॥ RESERVE YOUR INK SESSION ॥
          </h1>
          <p className="text-xs sm:text-sm text-studio-textMuted font-serif italic">
            Select your preferred sacred style, placement, and resident artist. You can also chat directly on WhatsApp at <strong className="text-studio-gold">+91 78079 66080</strong>.
          </p>
        </div>

        {/* Studio Policy Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto">
          <div className="ancient-stone-card ancient-ornate-corner p-4 rounded-lg flex items-center space-x-3 text-xs font-serif">
            <ShieldCheck className="w-5 h-5 text-studio-gold shrink-0" />
            <span>100% Single-use disposable cartridges &amp; medical cleanroom</span>
          </div>
          <div className="ancient-stone-card ancient-ornate-corner p-4 rounded-lg flex items-center space-x-3 text-xs font-serif">
            <Clock className="w-5 h-5 text-studio-gold shrink-0" />
            <span>Pre-session sacred geometry alignment with Master Sunil</span>
          </div>
          <div className="ancient-stone-card ancient-ornate-corner p-4 rounded-lg flex items-center space-x-3 text-xs font-serif">
            <Sparkles className="w-5 h-5 text-studio-gold shrink-0" />
            <span>Direct WhatsApp confirmation &amp; custom stencil preview</span>
          </div>
        </div>

        {/* Embed Full Booking Section Module */}
        <BookingSection />

      </div>
    </div>
  );
};
