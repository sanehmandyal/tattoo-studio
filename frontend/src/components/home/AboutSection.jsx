import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, HeartHandshake, ArrowRight, Sparkles } from 'lucide-react';
import { AncientDivider } from '../common/AncientDivider';

export const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-studio-secondary/80 border-t border-b border-studio-border/30 relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: TEXT & EDITORIAL STORY */}
          <div className="lg:col-span-6 space-y-6 lg:pl-4">
            <div>
              <span className="ancient-carved-heading text-2xl sm:text-3xl tracking-widest text-studio-gold uppercase block">
                ॥ २. THE SACRED ATELIER ॥
              </span>
              <p className="text-studio-bronzeLight text-xs font-serif tracking-widest mt-1 uppercase">
                Land of God Tattoo Studio • Devbhoomi Roots, Friends Colony, Una
              </p>
            </div>

            <AncientDivider symbol="ॐ" className="!my-2 !justify-start" />

            <div className="space-y-4 text-xs sm:text-sm text-studio-textMuted leading-relaxed font-serif">
              <p>
                <strong className="text-studio-gold font-display">LAND OF GOD TATTOO STUDIO</strong> was founded in Friends Colony, Una, Himachal Pradesh (Devbhoomi) to revive ancient Himalayan sacred geometry, spiritual Trishul archetypes, and Vedic symbology in permanent skin art. Led by Master Sunil, every piece is conceived as a spiritual talisman.
              </p>
              <p>
                We unite sacred ancient Sanskrit calligraphy with uncompromising hospital-grade sterility. 100% single-use medical cartridges and hypoallergenic organic pigments ensure every sacred mark heals with timeless brilliance.
              </p>
            </div>

            {/* Micro Highlights Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="ancient-stone-card ancient-ornate-corner p-4 rounded-lg flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-studio-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-studio-textMain font-display uppercase">Clinical Sanctum</h4>
                  <p className="text-[11px] text-studio-textMuted mt-0.5 font-serif">Autoclave sterilized & single-use cartridges</p>
                </div>
              </div>
              <div className="ancient-stone-card ancient-ornate-corner p-4 rounded-lg flex items-start space-x-3">
                <Award className="w-5 h-5 text-studio-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-studio-textMain font-display uppercase">Vedic Masters</h4>
                  <p className="text-[11px] text-studio-textMuted mt-0.5 font-serif">11+ years in sacred geometry & realism</p>
                </div>
              </div>
            </div>

            {/* Learn More link */}
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-studio-bronzeLight hover:text-studio-gold group transition-colors font-display"
              >
                <span>Read Our Devbhoomi Heritage</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* RIGHT: STUDIO INTERIOR ARCHITECTURE */}
          <div className="lg:col-span-6">
            <div className="ancient-stone-card ancient-ornate-corner p-2 rounded-2xl shadow-2xl relative group overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1200&q=80"
                alt="LAND OF GOD Tattoo Studio Atelier Friends Colony Una"
                className="w-full h-[360px] sm:h-[420px] object-cover rounded-xl filter brightness-90 contrast-110 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-2 bg-gradient-to-t from-studio-darker/95 via-transparent to-transparent flex items-end p-6 rounded-xl pointer-events-none">
                <div className="text-left space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-studio-gold bg-black/80 px-2.5 py-1 rounded border border-studio-bronze/50 font-serif">
                    🔱 Friends Colony, Una (HP)
                  </span>
                  <h4 className="text-sm font-bold text-studio-textMain font-display">
                    Sacred Private Tattoo Sanctum &amp; Cleanroom Atelier
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
