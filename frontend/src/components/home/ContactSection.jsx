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
  const [subject, setSubject] = useState('Studio Consultation');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please provide name, email, and your message');
      return;
    }

    setSubmitting(true);
    try {
      const res = await contactAPI.submit({ name, email, phone, subject, message });
      if (res.success) {
        setSubmitted(true);
        toast.success('Inquiry submitted! Our studio director will reply promptly.');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-studio-secondary/40 relative border-t border-studio-border/30">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header (Ancient Devbhoomi Styling) */}
        <div className="mb-10 border-b border-studio-border/30 pb-4 lg:pl-4">
          <h2 className="ancient-carved-heading text-2xl sm:text-3xl font-black tracking-widest text-studio-gold uppercase">
            ॥ ८. STUDIO SANCTUM &amp; CONSULTATIONS ॥
          </h2>
          <p className="text-studio-bronzeLight text-xs font-serif tracking-widest mt-1 uppercase">
            Friends Colony Atelier Visit, Custom Sacred Inquiries &amp; Direct Connection
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: DARK MAP EMBED (Friends Colony, Una, Himachal Pradesh Map) */}
          <div className="lg:col-span-6 rounded-xl overflow-hidden border border-studio-bronze/40 shadow-2xl relative bg-studio-darker h-[380px] lg:h-[450px]">
            <iframe
              title="LAND OF GOD TATTOO STUDIO Friends Colony Una Location Map"
              src="https://maps.google.com/maps?q=Friends%20Colony,%20Una,%20Himachal%20Pradesh%20174303&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full filter invert-[0.9] hue-rotate-[170deg] contrast-[1.2] opacity-80"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
            
            {/* Overlay Studio Tag */}
            <div className="absolute top-4 left-4 ancient-stone-card p-3 rounded-lg shadow-2xl text-left flex items-center space-x-3 border border-studio-bronze/50">
              <div className="w-10 h-10 rounded-full bg-black/80 p-1 border border-amber-400/40 shrink-0">
                <img src="/logo.png" alt="Land of God Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
                  <span className="text-xs font-bold text-studio-gold font-display uppercase tracking-wider">{settings.studioName || 'LAND OF GOD TATTOO STUDIO'}</span>
                </div>
                <p className="text-[11px] text-studio-textMuted mt-0.5 font-serif">
                  {settings.address?.street || 'Friends Colony'}, {settings.address?.city || 'Una'}, {settings.address?.state || 'Himachal Pradesh'} {settings.address?.zip || '174303'}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: STUDIO CONTACT INFO & FORM */}
          <div className="lg:col-span-6 ancient-stone-card ancient-ornate-corner p-6 rounded-xl space-y-6">
            
            {/* Contact Details Header Rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-studio-border/30 text-xs">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-studio-bronze shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-studio-textMain uppercase text-[11px]">Studio Address</h4>
                  <p className="text-studio-textMuted mt-0.5">Friends Colony, Una<br />Himachal Pradesh 174303, India</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Phone className="w-4 h-4 text-studio-bronze shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-studio-textMain uppercase text-[11px]">Direct Phone & WhatsApp</h4>
                  <p className="text-studio-textMuted mt-0.5 font-bold text-studio-bronzeLight">
                    <a href="tel:+917807966080" className="hover:underline">+91 78079 66080</a>
                  </p>
                  <a
                    href="https://wa.me/917807966080"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-[10px] text-emerald-400 font-semibold hover:underline mt-0.5"
                  >
                    💬 Direct WhatsApp Message
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Mail className="w-4 h-4 text-studio-bronze shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-studio-textMain uppercase text-[11px]">Email Desk</h4>
                  <p className="text-studio-textMuted mt-0.5">contact@landofgodtattoos.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-studio-bronze shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-studio-textMain uppercase text-[11px]">Studio Hours</h4>
                  <p className="text-studio-textMuted mt-0.5">Mon-Sat: 10:30am - 8:30pm<br />Sun: 11am - 7pm (By Appt)</p>
                </div>
              </div>
            </div>

            {/* Quick Consultation Inquiry Form */}
            {submitted ? (
              <div className="bg-studio-card/80 p-6 rounded-lg border border-studio-bronze/40 text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-studio-glowCyan mx-auto" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-studio-textMain">
                  Message Dispatched!
                </h4>
                <p className="text-xs text-studio-textMuted">
                  Thank you for contacting LAND OF GOD TATTOO STUDIO. Master Sunil and our team will review your notes and contact you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-bold text-studio-bronzeLight hover:underline uppercase"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-studio-textMuted mb-1 uppercase">Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-studio-secondary border border-studio-border focus:border-studio-bronze rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-studio-textMuted mb-1 uppercase">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-studio-secondary border border-studio-border focus:border-studio-bronze rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-studio-textMuted mb-1 uppercase">Message / Tattoo Concept</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Tell us about the tattoo idea, preferred artist, or consultation questions..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-studio-secondary border border-studio-border focus:border-studio-bronze rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-studio-bronze hover:bg-studio-bronzeLight text-studio-darker font-condensed font-bold py-2.5 px-4 text-xs uppercase tracking-[0.15em] rounded transition-all shadow-bronze flex items-center justify-center space-x-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Sending...' : 'Send Studio Inquiry'}</span>
                </button>
              </form>
            )}

          </div>

        </div>
      </div>
    </section>
  );
};
