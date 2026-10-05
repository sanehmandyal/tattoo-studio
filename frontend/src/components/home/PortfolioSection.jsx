import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { portfolioAPI } from '../../services/api';
import { ArrowRight, Eye, Heart, Maximize2, X } from 'lucide-react';
import { createPortfolioInquiryUrl } from '../../utils/whatsapp';
import { getFullImageUrl } from '../../utils/imageHelper';

const DEFAULT_PORTFOLIO = [
  {
    _id: 'sleeve-1',
    title: 'Sleeve',
    style: 'Sleeve',
    bodyPlacement: 'Full Arm / Sleeve',
    coverImage: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=800&q=80',
    description: 'Grand full geometric sleeve with sacred toroids and stippling.',
    likes: 340,
  },
  {
    _id: 'realism-2',
    title: 'Realism',
    style: 'Realism',
    bodyPlacement: 'Forearm / Bicep',
    coverImage: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80',
    description: 'Hyper-detailed classical sculpture portrait with soft atmospheric skin tones.',
    likes: 410,
  },
  {
    _id: 'blackwork-3',
    title: 'Blackwork',
    style: 'Blackwork',
    bodyPlacement: 'Chest & Sternum',
    coverImage: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=800&q=80',
    description: 'Deep saturated black ink composition with architectural gothic depth.',
    likes: 290,
  },
  {
    _id: 'watercolor-4',
    title: 'Watercolor',
    style: 'Watercolor',
    bodyPlacement: 'Shoulder & Ribs',
    coverImage: 'https://images.unsplash.com/photo-1590246814883-578351586a14?auto=format&fit=crop&w=800&q=80',
    description: 'Vibrant chromatic ink bleeds, teal-to-magenta gradients.',
    likes: 520,
  },
];

export const PortfolioSection = () => {
  const [portfolioItems, setPortfolioItems] = useState(DEFAULT_PORTFOLIO);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedLightbox, setSelectedLightbox] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await portfolioAPI.getAll({ limit: 12 });
        if (res.success && res.portfolio?.length > 0) {
          setPortfolioItems(res.portfolio);
        }
      } catch (err) {
        console.log('Using default portfolio catalog');
      }
    };
    fetchPortfolio();
  }, []);

  const styles = ['All', 'Sleeve', 'Realism', 'Blackwork', 'Watercolor', 'Geometric', 'Fine Line'];

  const filteredItems = activeFilter === 'All'
    ? portfolioItems
    : portfolioItems.filter(p => p.style.toLowerCase() === activeFilter.toLowerCase());

  return (
    <section id="portfolio" className="py-20 bg-studio-secondary/40 border-t border-studio-border/30 relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header (Ancient Devbhoomi Styling) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-studio-border/30 pb-4 lg:pl-4">
          <div>
            <h2 className="ancient-carved-heading text-2xl sm:text-3xl font-black tracking-widest text-studio-gold uppercase">
              ॥ ३. SACRED PORTFOLIO &amp; ARCHIVES ॥
            </h2>
            <p className="text-studio-bronzeLight text-xs font-serif tracking-widest mt-1 uppercase">
              Curated Devbhoomi Masterworks &amp; Spiritual Craft
            </p>
          </div>

          {/* Style Filter Chips */}
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            {styles.map(style => (
              <button
                key={style}
                onClick={() => setActiveFilter(style)}
                className={`text-xs font-serif px-3.5 py-1.5 rounded-lg transition-all ${
                  activeFilter === style
                    ? 'bg-gradient-to-r from-studio-bronze to-amber-700 text-white font-bold shadow-md border border-amber-400/40'
                    : 'bg-studio-secondary/90 text-studio-textMuted hover:text-studio-gold border border-studio-border/40'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.slice(0, 8).map((item) => (
            <div
              key={item._id}
              className="group relative ancient-stone-card ancient-ornate-corner rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-80 overflow-hidden bg-studio-secondary">
                <img
                  src={getFullImageUrl(item.coverImage || item.images?.[0])}
                  alt={item.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover filter contrast-110 brightness-95 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111517] via-transparent to-transparent opacity-85 group-hover:opacity-65 transition-opacity" />

                {/* Quick zoom button */}
                <button
                  onClick={() => setSelectedLightbox(item)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/80 backdrop-blur-md border border-studio-bronze/40 text-studio-gold hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                  title="Expand image"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Body Placement tag */}
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-[10px] font-bold text-studio-gold uppercase tracking-wider px-2.5 py-0.5 rounded border border-studio-bronze/40 shadow-sm font-serif">
                  {item.bodyPlacement}
                </div>
              </div>

              {/* Title & Style Info */}
              <div className="p-4 bg-transparent border-t border-studio-border/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-studio-textMain uppercase tracking-wide group-hover:text-studio-gold transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-[11px] font-serif font-bold text-studio-bronzeLight">
                    {item.style}
                  </span>
                </div>
                <p className="text-[11px] text-studio-textMuted line-clamp-2 mt-1 leading-relaxed font-serif">
                  {item.description}
                </p>
                
                <div className="mt-3 pt-2 border-t border-studio-border/20 flex items-center justify-between text-xs font-serif">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const waUrl = createPortfolioInquiryUrl(item.title, item.style, item.bodyPlacement);
                      window.open(waUrl, '_blank');
                    }}
                    className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 px-2.5 py-1 rounded transition-all shadow-sm"
                    title="Ask admin for tattoo details on WhatsApp"
                  >
                    <span>💬 WhatsApp Details</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedLightbox(item)}
                    className="text-studio-bronzeLight hover:text-studio-gold text-[11px] font-semibold font-display uppercase tracking-wider"
                  >
                    Expand →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedLightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-studio-card border border-studio-border rounded-xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedLightbox(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-[450px] bg-black flex items-center justify-center p-2">
                <img
                  src={selectedLightbox.coverImage || selectedLightbox.images?.[0]}
                  alt={selectedLightbox.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-6 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-bold text-studio-bronzeLight uppercase tracking-wider">
                    {selectedLightbox.style} Tattoo
                  </span>
                  <h3 className="font-condensed font-black text-2xl text-studio-textMain uppercase mt-1">
                    {selectedLightbox.title}
                  </h3>
                  <p className="text-xs text-studio-textMuted mt-1">
                    Placement: <strong className="text-studio-textMain">{selectedLightbox.bodyPlacement}</strong>
                  </p>
                  <p className="text-xs text-studio-textMuted mt-4 leading-relaxed font-serif">
                    {selectedLightbox.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-studio-border space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      const waUrl = createPortfolioInquiryUrl(
                        selectedLightbox.title,
                        selectedLightbox.style,
                        selectedLightbox.bodyPlacement
                      );
                      window.open(waUrl, '_blank');
                    }}
                    className="w-full bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/60 hover:border-emerald-400 text-emerald-300 font-bold py-2.5 px-4 text-xs tracking-wider uppercase text-center rounded flex items-center justify-center space-x-1.5 shadow-md transition-all"
                  >
                    <span>💬 Inquire on WhatsApp for Details</span>
                  </button>
                  <Link
                    to={`/booking?style=${encodeURIComponent(selectedLightbox.style)}&placement=${encodeURIComponent(selectedLightbox.bodyPlacement)}`}
                    onClick={() => setSelectedLightbox(null)}
                    className="w-full bg-studio-bronze hover:bg-studio-bronzeLight text-studio-darker font-bold py-2.5 px-4 text-xs font-condensed tracking-wider uppercase text-center rounded block"
                  >
                    Request Similar Tattoo Session
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
