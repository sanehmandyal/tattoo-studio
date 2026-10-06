import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, HeartHandshake, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-studio-secondary/50 border-t border-b border-white/5 relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: EDITORIAL STORY */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                About Our Studio
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                Precision Tattooing with Medical-Grade Hygiene
              </h2>
              <p className="text-zinc-400 text-sm mt-2">
                Land of God Tattoo Studio • Friends Colony, Una, Himachal Pradesh
              </p>
            </div>

            <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
              <p>
                <strong className="text-white">Land of God Tattoo Studio</strong> is Northern India's premier bespoke tattoo atelier, led by certified master artist Sunil. Located in Friends Colony, Una, we specialize in hyper-realistic portraits, sacred geometry, fine-line mantras, and custom body art.
              </p>
              <p>
                We prioritize client safety with hospital-grade sterilization, 100% single-use membrane needle cartridges, and premium vegan, hypoallergenic organic pigments.
              </p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-zinc-900/80 border border-white/10 p-4 rounded-xl flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Clinical Hygiene</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Autoclave sterilization &amp; 100% single-use needles</p>
                </div>
              </div>
              <div className="bg-zinc-900/80 border border-white/10 p-4 rounded-xl flex items-start space-x-3">
                <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Master Experience</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">10+ years in realism &amp; sacred custom tattoos</p>
                </div>
              </div>
            </div>

            {/* Link */}
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>Read Full Studio Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* RIGHT: STUDIO IMAGE */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group">
              <img
                src="https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1200&q=80"
                alt="Land of God Tattoo Studio in Friends Colony, Una"
                className="w-full h-[360px] sm:h-[420px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 pointer-events-none">
                <div className="text-left space-y-1">
                  <span className="text-[11px] font-semibold text-amber-300 bg-black/80 px-2.5 py-1 rounded-md border border-white/10">
                    Friends Colony, Una (HP)
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    Private Tattoo Atelier &amp; Sterile Procedure Suite
                  </h4>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
