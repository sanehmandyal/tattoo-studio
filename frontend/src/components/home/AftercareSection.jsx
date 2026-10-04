import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { aftercareAPI } from '../../services/api';
import { ShieldCheck, Droplets, Sparkles, AlertTriangle, Sun, HeartPulse, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

const AFTERCARE_ITEMS = [
  {
    id: 1,
    icon: ShieldCheck,
    title: 'Immediate Studio Wrap Care',
    shortDesc: 'Detailed care instructions for healing fresh tattoo and barrier bandage removal.',
    details: 'Keep medical second-skin intact for 3 to 4 days. If classic absorbent wrap was used, gently remove after 3 to 5 hours under lukewarm water with clean hands.',
  },
  {
    id: 2,
    icon: Droplets,
    title: 'Cleansing & Lukewarm Wash',
    shortDesc: 'Detailed care instructions for healing tattoos with warm water and fragrance-free soap.',
    details: 'Wash 2-3 times daily using only clean bare fingertips and unscented antibacterial soap. Pat dry with fresh single-use paper towels. Never scrub.',
  },
  {
    id: 3,
    icon: Sparkles,
    title: 'Hydration & Micro-Balm Care',
    shortDesc: 'Detailed care instructions for nourishing skin without smothering pores.',
    details: 'Apply a micro-thin layer of studio-approved ointment starting on Day 3. Keep skin looking satin, never saturated or greasy.',
  },
  {
    id: 4,
    icon: AlertTriangle,
    title: 'Zero Submersion & Scratching',
    shortDesc: 'Detailed care instructions for healing stages, avoiding pools, oceans and picking.',
    details: 'Strictly avoid swimming, saunas, hot tubs, and baths for 3 full weeks. Never pick or scratch flaking scabs — let skin shed naturally in the shower.',
  },
  {
    id: 5,
    icon: Sun,
    title: 'Sun Protection & UV Defense',
    shortDesc: 'Detailed instructions for long-term pigment contrast and SPF defense.',
    details: 'Keep out of direct sunlight during the 4-week healing period. Once fully healed, apply SPF 50+ sunscreen religiously to prevent photo-fading.',
  },
  {
    id: 6,
    icon: HeartPulse,
    title: 'When to Contact the Studio',
    shortDesc: 'Expert guidance on normal healing sensations versus clinical complications.',
    details: 'Redness and tenderness are expected for 48 hours. If excessive heat, yellow discharge, or spreading streaks develop, contact our studio team or a doctor immediately.',
  },
];

export const AftercareSection = () => {
  const [aftercareList, setAftercareList] = useState(AFTERCARE_ITEMS);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchAftercare = async () => {
      try {
        const res = await aftercareAPI.getAll();
        if (res.success && res.aftercare && res.aftercare.length > 0) {
          const formatted = res.aftercare.map((item, idx) => ({
            id: item._id || idx,
            icon: ShieldCheck,
            title: item.title,
            shortDesc: `${item.phase || 'Healing Stage'}: ${item.instructions ? item.instructions.slice(0, 90) + '...' : ''}`,
            details: `${item.instructions} ${item.dos && item.dos.length ? '\n\nDo: ' + item.dos.join(', ') : ''} ${item.donts && item.donts.length ? '\n\nAvoid: ' + item.donts.join(', ') : ''}`,
          }));
          setAftercareList(formatted);
        }
      } catch (err) {
        // Fallback to default
      }
    };
    fetchAftercare();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="aftercare" className="py-20 bg-studio-secondary/30 border-t border-studio-border/30 relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 border-b border-studio-border/30 pb-4 lg:pl-4">
          <div>
            <h2 className="ancient-carved-heading text-2xl sm:text-3xl font-black tracking-widest text-studio-gold uppercase">
              ॥ ६. SACRED AFTERCARE &amp; HEALING ॥
            </h2>
            <p className="text-studio-bronzeLight text-xs font-serif tracking-widest mt-1 uppercase">
              Hospital-Grade Hygiene &amp; Lifetime Pigment Brilliance
            </p>
          </div>
          <Link
            to="/aftercare"
            className="mt-4 sm:mt-0 text-xs font-bold font-display uppercase tracking-widest text-studio-bronzeLight hover:text-studio-gold flex items-center space-x-1"
          >
            <span>Full Healing Guide</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 2x3 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aftercareList.map((item) => {
            const Icon = item.icon || ShieldCheck;
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => toggleExpand(item.id)}
                className={`ancient-stone-card ancient-ornate-corner p-5 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isExpanded
                    ? 'border-amber-400/60 bg-[#161B1D]'
                    : 'border-studio-border/40 hover:border-amber-400/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-black/80 border border-studio-bronze/40 flex items-center justify-center text-studio-gold shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-bold text-sm text-studio-textMain">
                      {item.title}
                    </h3>
                  </div>
                  <button className="text-studio-gold p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-xs text-studio-textMuted mt-3 leading-relaxed font-serif">
                  {item.shortDesc}
                </p>

                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-studio-border/30 text-xs text-studio-gold leading-relaxed font-serif animate-in fade-in duration-200">
                    {item.details}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Direct WhatsApp Emergency Aftercare Helpline */}
        <div className="mt-10 ancient-stone-card ancient-ornate-corner p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-emerald-500/40">
          <div className="flex items-center space-x-4 text-left">
            <div className="w-12 h-12 rounded-full bg-emerald-950 flex items-center justify-center text-emerald-400 border border-emerald-500/50 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-white">
                Need Immediate Aftercare Guidance?
              </h4>
              <p className="text-xs text-studio-textMuted font-serif">
                Chat directly with Master Sunil and our Una atelier team on WhatsApp for any healing questions.
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/917807966080?text=Hello%20Master%20Sunil!%20I%20have%20an%20urgent%20aftercare%20question%20about%20my%20healing%20tattoo."
            target="_blank"
            rel="noreferrer"
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-display font-bold px-6 py-3 text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center space-x-2 shrink-0 border border-emerald-300/40"
          >
            <span>💬 WhatsApp 24/7 Helpline</span>
          </a>
        </div>

      </div>
    </section>
  );
};
