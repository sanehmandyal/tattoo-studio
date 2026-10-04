import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, PhoneCall, ShieldCheck, MapPin, Calendar } from 'lucide-react';
import { STUDIO_WHATSAPP_NUMBER, getStudioWhatsAppUrl, createBookingWhatsAppUrl } from '../../utils/whatsapp';

export const FloatingWhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const quickPrompts = [
    {
      title: '🔱 Mahadev / Sacred Tattoo Consultation',
      text: 'Hello Master Sunil! I want to get a custom Lord Shiva / Mahadev Trishul sacred geometry tattoo done. Can we discuss ideas and pricing?',
    },
    {
      title: '📅 Book Tattoo Session',
      text: 'Hi Land of God team! I would like to book a tattoo appointment at your Friends Colony, Una studio. What dates are available this week?',
    },
    {
      title: '📍 Studio Location & Timing',
      text: 'Hello! Could you please send me the exact studio location in Friends Colony, Una and your visiting hours?',
    },
    {
      title: '🛡️ Aftercare Question',
      text: 'Hi! I have a query regarding my healing tattoo and aftercare ointment. Can you please guide me?',
    },
  ];

  const handleSendCustom = (e) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    window.open(getStudioWhatsAppUrl(customMsg), '_blank');
    setCustomMsg('');
    setIsOpen(false);
  };

  const handleSelectPrompt = (text) => {
    window.open(getStudioWhatsAppUrl(text), '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Quick Chat Popup Card */}
      {isOpen && (
        <div className="mb-3 w-[340px] sm:w-[380px] ancient-stone-card ancient-ornate-corner rounded-2xl shadow-2xl border border-amber-400/50 overflow-hidden animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-black p-4 flex items-center justify-between border-b border-emerald-500/30">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-md">
                  <MessageCircle className="w-6 h-6 fill-current" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-black animate-pulse" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-white flex items-center space-x-1.5">
                  <span>Land of God Tattoo Studio</span>
                </h4>
                <p className="text-[11px] text-emerald-300 font-serif">Online • Master Sunil (+91 78079 66080)</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body with Quick Actions */}
          <div className="p-4 space-y-3 bg-[#111517]">
            <p className="text-xs text-studio-textMuted font-serif">
              Welcome to <span className="text-studio-gold font-bold">Land of God Tattoo Studio</span> (Friends Colony, Una). Tap a topic or type a message to start chatting instantly on WhatsApp:
            </p>

            {/* Quick Prompts List */}
            <div className="space-y-1.5">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPrompt(q.text)}
                  className="w-full text-left p-2.5 rounded-lg bg-black/60 hover:bg-emerald-950/60 border border-studio-border/40 hover:border-emerald-500/60 text-xs text-studio-textMain font-serif transition-all flex items-center justify-between group"
                >
                  <span className="font-medium text-studio-bronzeLight group-hover:text-emerald-300">{q.title}</span>
                  <span className="text-[11px] text-emerald-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Chat →</span>
                </button>
              ))}
            </div>

            {/* Custom Text Input */}
            <form onSubmit={handleSendCustom} className="pt-2 flex items-center space-x-2">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Type your tattoo idea..."
                className="flex-1 bg-black/70 border border-studio-border/60 focus:border-emerald-400 text-xs text-white rounded-lg px-3 py-2 focus:outline-none font-serif"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg transition-colors shadow-md"
                title="Send to WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Bottom Footer Note */}
          <div className="bg-black/80 px-4 py-2 text-[10px] text-studio-textMuted/70 text-center border-t border-studio-border/20 font-serif">
            ⚡ Direct connection to Master Sunil & Land of God Studio team
          </div>
        </div>
      )}

      {/* Floating Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center space-x-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-4 py-3 rounded-full shadow-2xl shadow-emerald-900/60 border-2 border-emerald-300/40 transform hover:scale-105 transition-all duration-300 font-display"
        aria-label="Chat on WhatsApp"
      >
        <span className="relative">
          <MessageCircle className="w-6 h-6 fill-current" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-emerald-600 animate-ping" />
        </span>
        <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline-block">
          WhatsApp Us
        </span>
      </button>
    </div>
  );
};

export default FloatingWhatsAppButton;
