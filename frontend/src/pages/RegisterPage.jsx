import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, MessageSquare } from 'lucide-react';

export const RegisterPage = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-studio-bg flex items-center justify-center px-4 lg:pl-12">
      <Helmet>
        <title>Registration Restricted — LAND OF GOD TATTOO STUDIO</title>
      </Helmet>

      <div className="max-w-md w-full glass-panel-dark p-8 rounded-2xl border border-studio-bronze/60 shadow-2xl space-y-6 text-center">
        <div className="w-14 h-14 bg-studio-bronze/20 border border-studio-gold/60 rounded-full flex items-center justify-center mx-auto text-studio-gold shadow-lg">
          <ShieldAlert className="w-8 h-8 text-studio-gold" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-studio-bronzeLight">
            ॥ CLIENT NOTICE ॥
          </span>
          <h1 className="ancient-carved-heading text-2xl font-black uppercase tracking-wider text-studio-textMain">
            No Account Required
          </h1>
          <p className="text-xs text-studio-textMuted font-serif leading-relaxed">
            At <strong>Land of God Tattoo Studio</strong>, clients do not need to create or register an account. All appointments, 3D design previews, and tattoo consultations are handled directly via WhatsApp or our online booking form.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <a
            href="https://wa.me/917807966080"
            target="_blank"
            rel="noreferrer"
            className="w-full bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-400 py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Book Directly on WhatsApp (+91 78079 66080)</span>
          </a>

          <Link
            to="/booking"
            className="w-full bg-gradient-to-r from-studio-bronze to-amber-700 hover:from-amber-600 text-white py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md"
          >
            <span>Online Booking Form</span>
          </Link>
        </div>

        <div className="border-t border-studio-border/30 pt-4">
          <Link
            to="/login"
            className="text-xs text-studio-bronzeLight hover:text-studio-gold inline-flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Studio Admin &amp; Staff Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
