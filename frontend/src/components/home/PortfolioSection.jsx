import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { portfolioAPI } from '../../services/api';
import { ArrowRight, Eye, Heart, Maximize2, X, MessageSquare } from 'lucide-react';
import { createPortfolioInquiryUrl } from '../../utils/whatsapp';
import { getFullImageUrl } from '../../utils/imageHelper';

const DEFAULT_PORTFOLIO = [
  {
    _id: 'port-trishul',
    title: 'Mahadev Trishul & Sacred Om',
    style: 'Geometric',
    bodyPlacement: 'Full Arm Sleeve',
    coverImage: '/images/tattoos/mahadev_trishul.jpg',
    description: 'Sacred Trishul emblem entwined with Damru, Crescent Moon, and Om dotwork geometry.',
    likes: 490,
  },
  {
    _id: 'port-peony',
    title: 'Himalayan Wild Peony & Moon',
    style: 'Minimalist',
    bodyPlacement: 'Forearm / Wrist',
    coverImage: '/images/tattoos/moon_flora.jpg',
    description: 'Delicate single-needle crescent moon and wild Himalayan peony with celestial stippling.',
    likes: 540,
  },
  {
    _id: 'port-serpent',
    title: 'Serpent & Peony Fine Line',
    style: 'Fine Line',
    bodyPlacement: 'Forearm / Ribs',
    coverImage: '/images/tattoos/serpent_peony.jpg',
    description: 'Fluid serpentine contours entwined around wild mountain flora.',
    likes: 480,
  },
  {
    _id: 'port-lotus',
    title: 'Sacred Lotus & Unalome',
    style: 'Spiritual',
    bodyPlacement: 'Spine & Collarbone',
    coverImage: '/images/tattoos/sacred_lotus.jpg',
    description: 'Devbhoomi sacred unalome lotus bloom with dotwork chakra alignment.',
    likes: 510,
  },
  {
    _id: 'port-lion',
    title: 'Geometric Himalayan Lion',
    style: 'Geometric',
    bodyPlacement: 'Chest & Sternum',
    coverImage: '/images/tattoos/geometric_lion.jpg',
    description: 'Polygonal geometric lion head with Himalayan mountain line art.',
    likes: 380,
  },
  {
    _id: 'port-mandala',
    title: 'Devbhoomi Sacred Mandala',
    style: 'Mandala',
    bodyPlacement: 'Shoulder & Back',
    coverImage: '/images/tattoos/sacred_mandala.jpg',
    description: 'Intricate radial sacred geometry mandala with fine pointillism.',
    likes: 420,
  },
  {
    _id: 'port-rose',
    title: 'Botanical Sacred Rose',
    style: 'Botanical',
    bodyPlacement: 'Forearm / Wrist',
    coverImage: '/images/tattoos/sacred_rose.jpg',
    description: 'Classical botanical rose with delicate thorns and layered petals.',
    likes: 460,
  },
  {
    _id: 'port-skull',
    title: 'Gothic Blackwork Skull',
    style: 'Blackwork',
    bodyPlacement: 'Upper Arm / Calf',
    coverImage: '/images/tattoos/gothic_skull.jpg',
    description: 'Detailed anatomical skull with dark baroque ornamentation and heavy blackwork shading.',
    likes: 390,
  },
  {
    _id: 'port-dagger',
    title: 'Trishul Dagger & Sacred Heart',
    style: 'Neo-Traditional',
    bodyPlacement: 'Forearm / Calf',
    coverImage: '/images/tattoos/trishul_dagger.jpg',
    description: 'Ornamental sacred Trishul blade with radiant rays and mystical geometry.',
    likes: 530,
  },
];

const getAuthenticImageForTitle = (title, currentImage) => {
  if (currentImage && !currentImage.includes('unsplash.com') && !currentImage.includes('placeholder')) {
    return currentImage;
  }
  const t = (title || '').toLowerCase();
  if (t.includes('trishul') || t.includes('shiva') || t.includes('mahadev')) {
    if (t.includes('dagger')) return '/images/tattoos/trishul_dagger.jpg';
    return '/images/tattoos/mahadev_trishul.jpg';
  }
  if (t.includes('moon') || t.includes('flora') || t.includes('peony')) {
    if (t.includes('serpent') || t.includes('snake')) return '/images/tattoos/serpent_peony.jpg';
    return '/images/tattoos/moon_flora.jpg';
  }
  if (t.includes('serpent') || t.includes('snake')) {
    return '/images/tattoos/serpent_peony.jpg';
  }
  if (t.includes('lotus') || t.includes('unalome') || t.includes('watercolor')) {
    return '/images/tattoos/sacred_lotus.jpg';
  }
  if (t.includes('lion')) {
    return '/images/tattoos/geometric_lion.jpg';
  }
  if (t.includes('mandala') || t.includes('yantra')) {
    return '/images/tattoos/sacred_mandala.jpg';
  }
  if (t.includes('rose') || t.includes('botanical')) {
    return '/images/tattoos/sacred_rose.jpg';
  }
  if (t.includes('skull') || t.includes('gothic')) {
    return '/images/tattoos/gothic_skull.jpg';
  }
  if (t.includes('dagger')) {
    return '/images/tattoos/trishul_dagger.jpg';
  }
  return currentImage || '/images/tattoos/mahadev_trishul.jpg';
};

export const PortfolioSection = () => {
  const [portfolioItems, setPortfolioItems] = useState(DEFAULT_PORTFOLIO);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedLightbox, setSelectedLightbox] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await portfolioAPI.getAll({ limit: 12 });
        if (res.success && res.portfolio?.length > 0) {
          const sanitized = res.portfolio.map(item => ({
            ...item,
            coverImage: getAuthenticImageForTitle(item.title, item.coverImage)
          }));
          setPortfolioItems(sanitized);
        }
      } catch (err) {
        // Fallback to default catalog
      }
    };
    fetchPortfolio();
  }, []);

  const styles = ['All', 'Geometric', 'Fine Line', 'Botanical', 'Blackwork', 'Neo-Traditional', 'Spiritual', 'Mandala'];

  const filteredItems = activeFilter === 'All'
    ? portfolioItems
    : portfolioItems.filter(p => p.style?.toLowerCase() === activeFilter.toLowerCase());

  return (
    <section id="portfolio" className="py-20 bg-studio-bg border-t border-b border-white/5 relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Curated Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Featured Portfolio
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Explore bespoke tattoos crafted by Master Sunil &amp; resident artists
            </p>
          </div>

          {/* Style Filter Chips */}
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            {styles.map(style => (
              <button
                key={style}
                onClick={() => setActiveFilter(style)}
                className={`text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                  activeFilter === style
                    ? 'bg-amber-400 text-black font-bold shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
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
              className="group bg-zinc-900/80 border border-white/10 hover:border-amber-400/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-lg"
            >
              {/* Image Container */}
              <div className="relative h-72 overflow-hidden bg-black">
                <img
                  src={getFullImageUrl(item.coverImage || item.images?.[0])}
                  alt={item.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Top style badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-black/80 backdrop-blur-sm text-zinc-200 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border border-white/10">
                    {item.style}
                  </span>
                </div>

                {/* Quick overlay buttons */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => setSelectedLightbox(item)}
                    className="p-2.5 rounded-full bg-white text-black hover:bg-amber-400 transition-colors shadow-lg"
                    title="View Full Size"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const waUrl = createPortfolioInquiryUrl(item.title, item.style);
                      window.open(waUrl, '_blank');
                    }}
                    className="p-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-lg"
                    title="Inquire on WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white truncate">
                    {item.title}
                  </h3>
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-red-500/20 text-red-400" />
                    <span>{item.likes || 120}</span>
                  </span>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2">
                  {item.description || `${item.style} custom piece by Master Sunil.`}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-white/5">
                  <span className="text-[11px] text-zinc-400">{item.bodyPlacement || 'Custom'}</span>
                  <button
                    onClick={() => {
                      const waUrl = createPortfolioInquiryUrl(item.title, item.style);
                      window.open(waUrl, '_blank');
                    }}
                    className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Inquire on WhatsApp →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-10 text-center">
          <Link
            to="/portfolio"
            className="inline-flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 text-white border border-white/15 hover:border-amber-400 px-6 py-3 rounded-lg text-xs uppercase tracking-wider font-bold transition-all"
          >
            <span>Explore Complete Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedLightbox && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedLightbox(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedLightbox(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/80 text-white hover:bg-white hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-96 md:h-[500px] bg-black">
                <img
                  src={getFullImageUrl(selectedLightbox.coverImage || selectedLightbox.images?.[0])}
                  alt={selectedLightbox.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 md:p-8 flex flex-col justify-between text-left space-y-4">
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    {selectedLightbox.style} • {selectedLightbox.bodyPlacement}
                  </span>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedLightbox.title}
                  </h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {selectedLightbox.description || 'Custom crafted design at Land of God Tattoo Studio in Friends Colony, Una.'}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      const waUrl = createPortfolioInquiryUrl(selectedLightbox.title, selectedLightbox.style);
                      window.open(waUrl, '_blank');
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg text-xs uppercase tracking-wider transition-colors"
                  >
                    💬 Inquire This Design on WhatsApp
                  </button>
                  <Link
                    to="/booking"
                    className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold py-3 px-4 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center transition-colors"
                  >
                    Book Consultation
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
