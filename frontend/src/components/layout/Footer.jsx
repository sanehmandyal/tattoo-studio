import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, MapPin, Phone, Mail, Clock, ArrowUp, Sparkles } from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-studio-darker border-t border-studio-border/50 text-studio-textMuted pt-16 pb-8 lg:pl-12 transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-studio-border/30">
          
          {/* Studio Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-studio-bronze/40 to-black/90 flex items-center justify-center p-0.5 shadow-md border border-studio-bronze/60">
                <img src="/logo.png" alt="Land of God Tattoo Studio Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-lg tracking-[0.18em] text-studio-textMain uppercase leading-tight">
                  LAND OF <span className="text-studio-bronze">GOD</span>
                </span>
                <span className="text-[9px] tracking-[0.22em] text-studio-bronzeLight uppercase font-bold">
                  TATTOO STUDIO • FRIENDS COLONY, UNA
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-studio-textMuted">
              Devbhoomi's premier custom tattoo studio in Friends Colony, Una, Himachal Pradesh. Master artistry in sacred Mahadev motifs, realism portraits, fine-line mantras, and sterile hospital-grade procedures.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded bg-studio-card border border-studio-border/50 flex items-center justify-center text-studio-textMuted hover:text-studio-bronzeLight hover:border-studio-bronze transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded bg-studio-card border border-studio-border/50 flex items-center justify-center text-studio-textMuted hover:text-studio-bronzeLight hover:border-studio-bronze transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/917807966080"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 text-xs rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:border-emerald-400 flex items-center space-x-1.5 font-semibold transition-colors"
              >
                <span>💬 WhatsApp (7807966080)</span>
              </a>
              <a
                href="https://share.google/8Ck6bnKVFP2JNuUQT"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 text-xs rounded bg-studio-bronze/20 border border-studio-bronze/40 text-studio-bronzeLight hover:border-studio-bronze flex items-center space-x-1 font-semibold transition-colors"
              >
                <span>⭐ Google 5.0★</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-studio-bronzeLight mb-4 font-display">
              Studio Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-studio-textMain transition-colors">About Devbhoomi Studio</Link></li>
              <li><Link to="/interactive-3d" className="hover:text-studio-textMain transition-colors">3D Tattoo Placement Lab</Link></li>
              <li><Link to="/portfolio" className="hover:text-studio-textMain transition-colors">Curated Portfolio Gallery</Link></li>
              <li><Link to="/booking" className="hover:text-studio-textMain transition-colors">Book Custom Session</Link></li>
              <li><Link to="/aftercare" className="hover:text-studio-textMain transition-colors">Sterile Aftercare Guide</Link></li>
              <li><Link to="/blog" className="hover:text-studio-textMain transition-colors">Ink Well Journal & Guides</Link></li>
            </ul>
          </div>

          {/* Tattoo Styles */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-studio-bronzeLight mb-4 font-display">
              Mastery Styles
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/portfolio?style=Geometric" className="hover:text-studio-textMain transition-colors">Sacred Mahadev & Mandalas</Link></li>
              <li><Link to="/portfolio?style=Realism" className="hover:text-studio-textMain transition-colors">Photographic Portrait Realism</Link></li>
              <li><Link to="/portfolio?style=Fine+Line" className="hover:text-studio-textMain transition-colors">Sanskrit Mantras & Micro Line</Link></li>
              <li><Link to="/portfolio?style=Blackwork" className="hover:text-studio-textMain transition-colors">Heavy Blackwork & Devbhoomi Dark Art</Link></li>
              <li><Link to="/portfolio?style=Color" className="hover:text-studio-textMain transition-colors">Himalayan Botanical & Color</Link></li>
              <li><Link to="/portfolio?style=Neo-Traditional" className="hover:text-studio-textMain transition-colors">Neo-Traditional & Animals</Link></li>
            </ul>
          </div>

          {/* Studio Visit & Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-studio-bronzeLight mb-4 font-display">
              Una Atelier & Hours
            </h4>
            <div className="flex items-start space-x-2 text-xs">
              <MapPin className="w-4 h-4 text-studio-bronze shrink-0 mt-0.5" />
              <span>Friends Colony, Una, Himachal Pradesh 174303, India</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <Phone className="w-4 h-4 text-studio-bronze shrink-0" />
              <a href="tel:+917807966080" className="hover:text-studio-bronzeLight transition-colors font-bold">+91 78079 66080</a>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <Mail className="w-4 h-4 text-studio-bronze shrink-0" />
              <span>contact@landofgodtattoos.com</span>
            </div>
            <div className="flex items-start space-x-2 text-xs pt-1">
              <Clock className="w-4 h-4 text-studio-bronze shrink-0 mt-0.5" />
              <div>
                <p>Mon - Sat: 10:30 AM – 8:30 PM</p>
                <p>Sun: 11:00 AM – 7:00 PM (By Appt)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-studio-textMuted/70 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} LAND OF GOD TATTOO STUDIO (Una, Himachal Pradesh). All rights reserved. Hospital-grade sterile artistry.</p>
          <div className="flex items-center space-x-6">
            <a href="https://share.google/8Ck6bnKVFP2JNuUQT" target="_blank" rel="noreferrer" className="text-studio-bronzeLight hover:underline">Google Business Profile</a>
            <Link to="/admin" className="text-studio-gold hover:underline">Staff Admin</Link>
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1 text-studio-bronzeLight hover:text-studio-textMain transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
