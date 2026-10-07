import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, MapPin, Phone, Mail, Clock, ArrowUp, Star, MessageCircle, ExternalLink } from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#08090c] border-t border-white/10 text-zinc-400 pt-16 pb-12 transition-colors relative z-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Column 1: Studio Brand & Quick Connect */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-amber-500/30 to-black flex items-center justify-center p-0.5 shadow-lg border border-amber-500/50">
                <img src="/logo.png" alt="Land of God Tattoo Studio" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-lg tracking-[0.18em] text-white uppercase leading-tight">
                  LAND OF <span className="text-amber-400">GOD</span>
                </span>
                <span className="text-[9px] tracking-[0.22em] text-amber-300/80 uppercase font-bold">
                  TATTOO STUDIO • FRIENDS COLONY, UNA
                </span>
              </div>
            </div>
            
            <p className="text-xs leading-relaxed text-zinc-400">
              Devbhoomi's premier custom tattoo studio in Friends Colony, Una, Himachal Pradesh. Master artistry in sacred Mahadev motifs, realism portraits, fine-line mantras, and sterile hospital-grade procedures.
            </p>

            {/* Social & Direct Connect Badges */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center space-x-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-amber-400 hover:text-black border border-white/10 flex items-center justify-center text-zinc-300 transition-all shadow-sm"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-amber-400 hover:text-black border border-white/10 flex items-center justify-center text-zinc-300 transition-all shadow-sm"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/917807966080"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 text-xs rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 flex items-center space-x-1.5 font-semibold transition-all shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>

              <div>
                <a
                  href="https://share.google/8Ck6bnKVFP2JNuUQT"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1 text-xs rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 font-semibold transition-all shadow-sm"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Google Verified 5.0★</span>
                  <ExternalLink className="w-3 h-3 text-amber-400/70 ml-0.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Studio Navigation */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4 font-display flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Studio Navigation</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/about" className="hover:text-amber-300 transition-colors">About Devbhoomi Studio</Link></li>
              <li><Link to="/portfolio" className="hover:text-amber-300 transition-colors">Curated Portfolio &amp; Gallery</Link></li>
              <li><Link to="/interactive-3d" className="hover:text-amber-300 transition-colors">3D Placement Designs Lab</Link></li>
              <li><Link to="/reviews" className="hover:text-amber-300 transition-colors">Google Verified Reviews (5.0★)</Link></li>
              <li><Link to="/aftercare" className="hover:text-amber-300 transition-colors">Sacred Aftercare Guide</Link></li>
              <li><Link to="/blog" className="hover:text-amber-300 transition-colors">Sacred Ink Journal &amp; Blogs</Link></li>
              <li><Link to="/calendar" className="hover:text-amber-300 transition-colors">Studio Calendar &amp; Slots</Link></li>
              <li><Link to="/booking" className="hover:text-amber-300 transition-colors">Book Custom Session</Link></li>
            </ul>
          </div>

          {/* Column 3: Mastery Styles */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4 font-display flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Mastery Styles</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/portfolio?style=Geometric" className="hover:text-amber-300 transition-colors">Sacred Mahadev &amp; Mandalas</Link></li>
              <li><Link to="/portfolio?style=Realism" className="hover:text-amber-300 transition-colors">Photographic Portrait Realism</Link></li>
              <li><Link to="/portfolio?style=Fine+Line" className="hover:text-amber-300 transition-colors">Sanskrit Mantras &amp; Micro Line</Link></li>
              <li><Link to="/portfolio?style=Blackwork" className="hover:text-amber-300 transition-colors">Heavy Blackwork &amp; Dark Art</Link></li>
              <li><Link to="/portfolio?style=Color" className="hover:text-amber-300 transition-colors">Himalayan Botanical &amp; Color</Link></li>
              <li><Link to="/portfolio?style=Neo-Traditional" className="hover:text-amber-300 transition-colors">Neo-Traditional &amp; Animals</Link></li>
            </ul>
          </div>

          {/* Column 4: Una Atelier & Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4 font-display flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Una Atelier &amp; Hours</span>
            </h4>
            <div className="flex items-start space-x-2.5 text-xs">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span className="text-zinc-300 leading-relaxed">Friends Colony, Una, Himachal Pradesh 174303, India</span>
            </div>
            <div className="flex items-center space-x-2.5 text-xs">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <a href="tel:+917807966080" className="text-amber-300 hover:text-white font-bold transition-colors">
                +91 78079 66080
              </a>
            </div>
            <div className="flex items-center space-x-2.5 text-xs">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-zinc-300">contact@landofgodtattoos.com</span>
            </div>
            <div className="flex items-start space-x-2.5 text-xs pt-1.5 border-t border-white/5">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-zinc-400">
                <p><span className="text-zinc-200 font-medium">Mon - Sat:</span> 10:30 AM – 8:30 PM</p>
                <p><span className="text-zinc-200 font-medium">Sun:</span> 11:00 AM – 7:00 PM (By Appt)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Sub-navigation */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 gap-4 text-center md:text-left">
          <p className="max-w-xl">
            © {new Date().getFullYear()} LAND OF GOD TATTOO STUDIO (Friends Colony, Una, HP). All rights reserved.
          </p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-5 pr-0 sm:pr-24">
            <a
              href="https://share.google/8Ck6bnKVFP2JNuUQT"
              target="_blank"
              rel="noreferrer"
              className="text-amber-400/80 hover:text-amber-300 transition-colors"
            >
              Google Profile
            </a>
            <span className="text-zinc-700 hidden sm:inline">•</span>
            <Link to="/admin" className="text-amber-400/80 hover:text-amber-300 transition-colors">
              Staff Admin
            </Link>
            <span className="text-zinc-700 hidden sm:inline">•</span>
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1 text-zinc-400 hover:text-white transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
