import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { portfolioAPI, artistsAPI } from '../services/api';
import { Search, Filter, Heart, Eye, Maximize2, X } from 'lucide-react';
import { createPortfolioInquiryUrl } from '../utils/whatsapp';

export const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [artists, setArtists] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [selectedArtist, setSelectedArtist] = useState('All');
  const [selectedPlacement, setSelectedPlacement] = useState('All');
  const [search, setSearch] = useState('');
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);

  const styles = ['All', 'Sleeve', 'Realism', 'Blackwork', 'Watercolor', 'Geometric', 'Fine Line', 'Traditional', 'Japanese'];
  const placements = ['All', 'Forearm', 'Upper Arm / Sleeve', 'Chest & Sternum', 'Full Back', 'Shoulder', 'Wrist', 'Thigh', 'Calf'];

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await artistsAPI.getAll();
        if (res.success) setArtists(res.artists);
      } catch (err) {
        console.error(err);
      }
    };
    fetchArtists();
  }, []);

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedStyle !== 'All') params.style = selectedStyle;
        if (selectedArtist !== 'All') params.artist = selectedArtist;
        if (selectedPlacement !== 'All') params.placement = selectedPlacement;
        if (search) params.search = search;

        const res = await portfolioAPI.getAll(params);
        if (res.success) setPortfolio(res.portfolio);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [selectedStyle, selectedArtist, selectedPlacement, search]);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-studio-bg">
      <Helmet>
        <title>Curated Sacred Portfolio &amp; Gallery — LAND OF GOD TATTOO STUDIO</title>
        <meta
          name="description"
          content="Explore our extensive curated portfolio of sacred Mahadev Trishul tattoos, Devbhoomi sacred geometry, photographic realism portraits, fine line script, and custom masterpieces."
        />
      </Helmet>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-studio-bronzeLight">
            Sacred Devbhoomi Archive
          </span>
          <h1 className="ancient-carved-heading text-4xl sm:text-5xl uppercase tracking-tight text-studio-textMain">
            Master Portfolio Gallery
          </h1>
          <p className="text-xs sm:text-sm text-studio-textMuted font-serif">
            Browse our living gallery of bespoke sacred ink and custom needlework in Friends Colony, Una (HP).
          </p>
        </div>

        {/* Filter Bar */}
        <div className="glass-panel p-4 rounded-xl border border-studio-border/50 mb-10 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-studio-textMuted absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search styles, motifs, tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-studio-card border border-studio-border rounded pl-9 pr-3 py-2 text-xs text-studio-textMain focus:outline-none focus:border-studio-bronze"
              />
            </div>

            {/* Style Selector */}
            <div>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full bg-studio-card border border-studio-border rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none focus:border-studio-bronze"
              >
                <option value="All">All Tattoo Styles</option>
                {styles.filter(s => s !== 'All').map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Placement Selector */}
            <div>
              <select
                value={selectedPlacement}
                onChange={(e) => setSelectedPlacement(e.target.value)}
                className="w-full bg-studio-card border border-studio-border rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none focus:border-studio-bronze"
              >
                <option value="All">All Body Placements</option>
                {placements.filter(p => p !== 'All').map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs text-studio-textMuted">
            Loading curated gallery...
          </div>
        ) : portfolio.length === 0 ? (
          <div className="py-20 text-center text-xs text-studio-textMuted space-y-2">
            <p className="text-base font-bold text-studio-textMain">No portfolio items matched your filter criteria.</p>
            <button
              onClick={() => { setSelectedStyle('All'); setSelectedArtist('All'); setSelectedPlacement('All'); setSearch(''); }}
              className="text-xs text-studio-bronzeLight hover:underline font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {portfolio.map((item) => (
              <div
                key={item._id}
                className="group relative bg-studio-card rounded-xl overflow-hidden border border-studio-border/50 hover:border-studio-bronze transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div className="relative h-80 overflow-hidden bg-studio-secondary">
                  <img
                    src={item.coverImage || item.images?.[0]}
                    alt={item.title}
                    className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-studio-darker/90 via-transparent to-transparent opacity-80" />

                  <button
                    onClick={() => setLightbox(item)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-studio-darker/80 text-studio-textMuted hover:text-studio-glowCyan flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  <span className="absolute top-3 left-3 bg-studio-bg/80 text-[10px] font-bold text-studio-bronzeLight uppercase px-2 py-0.5 rounded border border-studio-border/40">
                    {item.bodyPlacement}
                  </span>
                </div>

                <div className="p-4 bg-studio-card border-t border-studio-border/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-condensed font-bold text-lg text-studio-textMain uppercase">
                      {item.title}
                    </h3>
                    <span className="text-xs font-semibold text-studio-bronze">{item.style}</span>
                  </div>

                  <p className="text-xs text-studio-textMuted line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-studio-border/20 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const waUrl = createPortfolioInquiryUrl(item.title, item.style, item.bodyPlacement);
                        window.open(waUrl, '_blank');
                      }}
                      className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 px-2 py-0.5 rounded flex items-center space-x-1 transition-all"
                    >
                      <span>💬 WhatsApp Details</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLightbox(item)}
                      className="text-[11px] font-bold text-studio-bronzeLight hover:underline uppercase"
                    >
                      Expand →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-studio-card border border-studio-border rounded-xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-[480px] bg-black flex items-center justify-center p-2">
                <img
                  src={lightbox.coverImage || lightbox.images?.[0]}
                  alt={lightbox.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-6 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-bold text-studio-bronzeLight uppercase tracking-wider">
                    {lightbox.style} Tattoo
                  </span>
                  <h3 className="font-condensed font-black text-2xl text-studio-textMain uppercase mt-1">
                    {lightbox.title}
                  </h3>
                  <p className="text-xs text-studio-textMuted mt-1">
                    Placement: <strong className="text-studio-textMain">{lightbox.bodyPlacement}</strong>
                  </p>
                  <p className="text-xs text-studio-textMuted mt-4 leading-relaxed font-serif">
                    {lightbox.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-studio-border space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      const waUrl = createPortfolioInquiryUrl(
                        lightbox.title,
                        lightbox.style,
                        lightbox.bodyPlacement
                      );
                      window.open(waUrl, '_blank');
                    }}
                    className="w-full bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/60 hover:border-emerald-400 text-emerald-300 font-bold py-2.5 px-4 text-xs tracking-wider uppercase text-center rounded flex items-center justify-center space-x-1.5 shadow-md transition-all"
                  >
                    <span>💬 Inquire on WhatsApp for Details</span>
                  </button>
                  <Link
                    to={`/booking?style=${encodeURIComponent(lightbox.style)}&placement=${encodeURIComponent(lightbox.bodyPlacement)}`}
                    onClick={() => setLightbox(null)}
                    className="w-full bg-studio-bronze hover:bg-studio-bronzeLight text-studio-darker font-bold py-2.5 px-4 text-xs font-condensed tracking-wider uppercase text-center block rounded shadow-bronze"
                  >
                    Request Similar Tattoo Session
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
