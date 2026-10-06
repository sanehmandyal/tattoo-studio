import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { aftercareAPI } from '../../services/api';
import { ShieldCheck, Droplets, Sparkles, AlertTriangle, Sun, HeartPulse, ArrowRight } from 'lucide-react';

const AFTERCARE_ITEMS = [
  {
    id: 1,
    icon: ShieldCheck,
    title: '1. Initial Bandage & Protection',
    shortDesc: 'Medical-grade second-skin or protective wrap instructions.',
    details: 'Keep second-skin bandage on for 3 to 4 days. If classic wrap was used, gently remove after 3 to 5 hours under lukewarm water with clean hands.',
  },
  {
    id: 2,
    icon: Droplets,
    title: '2. Gentle Cleansing Protocol',
    shortDesc: 'Wash twice daily with fragrance-free antibacterial soap.',
    details: 'Wash 2-3 times daily using bare fingertips and unscented antibacterial soap. Pat dry with clean paper towels. Never rub or scrub.',
  },
  {
    id: 3,
    icon: Sparkles,
    title: '3. Hydration & Moisturizing',
    shortDesc: 'Apply a micro-thin layer of studio-approved aftercare balm.',
    details: 'Starting Day 3, apply a very light layer of aftercare balm. Keep the tattoo breathable and moisturized without over-saturating pores.',
  },
  {
    id: 4,
    icon: AlertTriangle,
    title: '4. No Submersion or Scratching',
    shortDesc: 'Avoid swimming pools, hot tubs, baths, and picking scabs.',
    details: 'Strictly avoid swimming, saunas, and soaking in tubs for 3 weeks. Allow any natural flaking to shed on its own in the shower.',
  },
  {
    id: 5,
    icon: Sun,
    title: '5. Sun & UV Protection',
    shortDesc: 'Shield from direct sun and use SPF 50+ once healed.',
    details: 'Keep away from direct sunlight during initial healing. Once healed, apply SPF 50+ sunscreen to keep lines and colors sharp for years.',
  },
  {
    id: 6,
    icon: HeartPulse,
    title: '6. Studio Support & Touch-ups',
    shortDesc: 'Direct WhatsApp support and complimentary touch-up window.',
    details: 'Have questions during your healing phase? Reach out to our studio team on WhatsApp anytime for personalized aftercare guidance.',
  },
];

export const AftercareSection = () => {
  const [aftercareList, setAftercareList] = useState(AFTERCARE_ITEMS);

  useEffect(() => {
    const fetchAftercare = async () => {
      try {
        const res = await aftercareAPI.getAll();
        if (res.success && res.aftercare && res.aftercare.length > 0) {
          const formatted = res.aftercare.map((item, idx) => ({
            id: item._id || idx,
            icon: ShieldCheck,
            title: item.title,
            shortDesc: item.phase ? `Stage: ${item.phase}` : 'Aftercare Guideline',
            details: item.instructions,
          }));
          setAftercareList(formatted);
        }
      } catch (err) {
        // Fallback to default
      }
    };
    fetchAftercare();
  }, []);

  return (
    <section id="aftercare" className="py-20 bg-studio-bg border-t border-b border-white/5 relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 border-b border-white/10 pb-4">
          <div className="text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Hygiene &amp; Safety
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Tattoo Aftercare &amp; Healing Guide
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Medical-grade aftercare protocol for lifetime pigment vibrance and healthy skin recovery
            </p>
          </div>
          <Link
            to="/aftercare"
            className="mt-4 sm:mt-0 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 flex items-center space-x-1"
          >
            <span>Complete Guide</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aftercareList.map((item) => {
            const IconComponent = item.icon || ShieldCheck;
            return (
              <div
                key={item.id}
                className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 text-left space-y-3 hover:border-amber-400/40 transition-all shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-white">
                  {item.title}
                </h3>
                <p className="text-xs font-medium text-amber-400/90">
                  {item.shortDesc}
                </p>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {item.details}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
