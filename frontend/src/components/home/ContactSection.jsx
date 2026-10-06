import React, { useState } from 'react';
import { contactAPI } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export const ContactSection = () => {
  const { settings } = useSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Consultation');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill in your name, email, and message');
      return;
    }

    setSubmitting(true);
    try {
      const res = await contactAPI.submit({ name, email, phone, subject, message });
      if (res.success) {
        setSubmitted(true);
        toast.success('Inquiry submitted! Our studio team will get back to you shortly.');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-studio-secondary/30 relative border-t border-b border-white/5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header */}
        <div className="mb-10 border-b border-white/10 pb-4 text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Get in Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Studio Location &amp; Inquiries
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Visit our studio in Friends Colony, Una or send a consultation message
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: GOOGLE MAP */}
          <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-zinc-950 h-[380px] lg:h-[460px]">
            <iframe
              title="Land of God Tattoo Studio Location Map"
              src="https://maps.google.com/maps?q=Friends%20Colony,%20Una,%20Himachal%20Pradesh%20174303&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full opacity-90"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
            
            {/* Overlay Tag */}
            <div className="absolute top-4 left-4 bg-zinc-900/95 backdrop-blur-md p-3.5 rounded-xl shadow-2xl text-left flex items-center space-x-3 border border-white/10">
              <div className="w-10 h-10 rounded-full bg-black p-1 border border-amber-400/40 shrink-0 flex items-center justify-center">
                <img src="/logo.png" alt="Land of God Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  Land of God Tattoo Studio
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Friends Colony, Una, Himachal Pradesh 174303
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTACT FORM & DETAILS */}
          <div className="lg:col-span-6 bg-zinc-900/80 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 text-left shadow-xl">
            
            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-white/10 text-xs">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white uppercase text-[11px]">Studio Address</h4>
                  <p className="text-zinc-400 mt-0.5">Friends Colony, Una<br />Himachal Pradesh 174303</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white uppercase text-[11px]">Direct Phone</h4>
                  <a href="tel:+917807966080" className="text-zinc-300 hover:text-amber-400 font-semibold block mt-0.5">
                    +91 78079 66080
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white uppercase text-[11px]">Email</h4>
                  <span className="text-zinc-400 mt-0.5 block">contact@landofgodtattoos.com</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white uppercase text-[11px]">Studio Hours</h4>
                  <p className="text-zinc-400 mt-0.5">Mon–Sat: 10:30 AM – 8:30 PM</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp CTA Button */}
            <a
              href="https://wa.me/917807966080"
              target="_blank"
              rel="noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 text-xs uppercase tracking-wider rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Direct WhatsApp Chat (+91 78079 66080)</span>
            </a>

            {/* Message Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rahul@example.com"
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                    Subject / Placement
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Forearm Realism Tattoo"
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                  Message / Tattoo Concept *
                </label>
                <textarea
                  required
                  rows="3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your tattoo idea, approximate size, reference image, or question..."
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold py-3 px-4 text-xs uppercase tracking-wider rounded-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Sending Message...' : 'Submit Inquiry'}</span>
              </button>
            </form>

          </div>

        </div>

      </div>
    </section>
  );
};
