import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ContactSection } from '../components/home/ContactSection';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';

export const ContactPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-studio-bg">
      <Helmet>
        <title>Contact &amp; Studio Location — LAND OF GOD TATTOO STUDIO (Una, HP)</title>
        <meta
          name="description"
          content="Visit Land of God Tattoo Studio in Friends Colony, Una, Himachal Pradesh. Chat directly on WhatsApp (+91 78079 66080) for custom inquiries and appointments."
        />
      </Helmet>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-studio-gold font-serif">
            🔱 DEVBHOOMI SANCTUM INQUIRIES 🔱
          </span>
          <h1 className="ancient-carved-heading text-3xl sm:text-5xl uppercase tracking-wider text-studio-textMain">
            ॥ STUDIO LOCATION &amp; WHATSAPP ॥
          </h1>
          <p className="text-xs sm:text-sm text-studio-textMuted font-serif italic">
            Located in Friends Colony, Una, Himachal Pradesh (174303). Connect directly with Master Sunil on WhatsApp at <strong className="text-studio-gold">+91 78079 66080</strong>.
          </p>
        </div>

        <ContactSection />

      </div>
    </div>
  );
};
