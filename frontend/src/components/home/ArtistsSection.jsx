import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { artistsAPI } from '../../services/api';
import { Star, ArrowRight, Instagram, Calendar, Sparkles } from 'lucide-react';

const DEFAULT_ARTISTS = [
  {
    _id: 'sunil-default',
    name: 'MASTER SUNIL (UNA)',
    slug: 'master-sunil',
    title: 'Founder & Master Tattooist — Sacred Devbhoomi & Realism',
    bio: 'Over a decade of mastery in custom Mahadev sacred geometry, spiritual Trishul archetypes, hyper-realistic portraits, and intricate fine line needlework in Una, Himachal Pradesh.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    specializations: ['Sacred Geometry', 'Spiritual & Mahadev', 'Realism', 'Fine Line'],
    rating: 5.0,
    isAvailable: true,
  },
  {
    _id: 'aman-default',
    name: 'AMAN VERMA',
    slug: 'aman-verma',
    title: 'Senior Resident — Fine Line & Sanskrit Calligraphy',
    bio: 'Specialist in razor-sharp Devanagari Sanskrit mantras, delicate Himachali mountain flora, geometric mandalas, and micro-needle detail.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    specializations: ['Fine Line', 'Sanskrit Mantras', 'Mandalas', 'Botanical'],
    rating: 4.98,
    isAvailable: true,
  },
  {
    _id: 'eliza-default',
    name: 'ELIZA',
    slug: 'eliza',
    title: 'Resident Artist — Ethereal Botanicals & Watercolor',
    bio: 'Renowned for soft floral watercolors, delicate Himalayan wildflowers, celestial motifs, and gentle organic linework.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    specializations: ['Botanical', 'Watercolor', 'Minimalist', 'Floral'],
    rating: 4.97,
    isAvailable: true,
  },
  {
    _id: 'vikram-default',
    name: 'VIKRAM THAKUR',
    slug: 'vikram-thakur',
    title: 'Resident Artist — Neo-Traditional & Heavy Blackwork',
    bio: 'Expert in high-contrast mythological warriors, Lord Shiva motifs, neo-traditional lions, and bold protective talismans.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    specializations: ['Blackwork', 'Neo-Traditional', 'Mythological', 'Dark Art'],
    rating: 4.96,
    isAvailable: true,
  },
];

export const ArtistsSection = () => {
  const [artists, setArtists] = useState(DEFAULT_ARTISTS);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await artistsAPI.getAll();
        if (res.success && res.artists?.length > 0) {
          setArtists(res.artists);
        }
      } catch (err) {
        console.log('Using default artist directory');
      }
    };
    fetchArtists();
  }, []);

  const handleBookArtist = (artist) => {
    navigate(`/booking?artistId=${artist._id}&artistName=${encodeURIComponent(artist.name)}`);
  };

  return (
    <section id="artists" className="py-20 bg-studio-bg relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header (Ancient Devbhoomi Styling) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 border-b border-studio-border/30 pb-4 lg:pl-4">
          <div>
            <h2 className="ancient-carved-heading text-2xl sm:text-3xl font-black tracking-widest text-studio-gold uppercase">
              ॥ ३. MASTER ARTISANS &amp; TATTOOISTS ॥
            </h2>
            <p className="text-studio-bronzeLight text-xs font-serif tracking-widest mt-1 uppercase">
              Sacred Devbhoomi Lineage • Friends Colony Atelier, Una
            </p>
          </div>
          <Link
            to="/artists"
            className="mt-4 sm:mt-0 text-xs font-bold font-display uppercase tracking-widest text-studio-bronzeLight hover:text-studio-gold flex items-center space-x-1"
          >
            <span>View All Masters</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {artists.slice(0, 4).map((artist) => (
            <div
              key={artist._id}
              className="ancient-stone-card ancient-ornate-corner rounded-xl overflow-hidden group flex flex-col justify-between transition-all duration-300"
            >
              {/* Top: Portrait & Status Badge */}
              <div className="relative h-72 overflow-hidden bg-studio-card/90">
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="w-full h-full object-cover object-top filter contrast-110 brightness-95 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111517] via-transparent to-transparent opacity-95" />
                
                {/* Available Badge */}
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-300 border border-amber-500/40 flex items-center space-x-1 shadow-sm font-serif">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>Accepting Bookings</span>
                </div>

                {/* Rating */}
                <div className="absolute bottom-3 left-4 flex items-center space-x-1 text-xs bg-black/85 backdrop-blur-sm px-2.5 py-0.5 rounded border border-studio-bronze/40 text-studio-gold font-serif">
                  <Star className="w-3.5 h-3.5 fill-studio-gold" />
                  <span className="font-bold">{artist.rating || '5.0'}</span>
                  <span className="text-[10px] text-studio-textMuted">/ 5.0</span>
                </div>
              </div>

              {/* Middle: Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-display font-black text-xl tracking-wider text-studio-textMain uppercase group-hover:text-studio-gold transition-colors">
                    {artist.name}
                  </h3>
                  <p className="text-xs text-studio-bronzeLight font-serif font-medium mt-0.5 italic">
                    {artist.title}
                  </p>
                  <p className="text-xs text-studio-textMuted mt-3 line-clamp-3 leading-relaxed font-serif">
                    {artist.bio}
                  </p>
                </div>

                {/* Specialization Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(artist.specializations || []).map((spec, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-black/50 text-studio-bronzeLight border border-studio-bronze/30 font-serif"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-studio-border/30 flex items-center justify-between">
                  <Link
                    to={`/artists/${artist.slug || artist._id}`}
                    className="text-xs font-bold font-display tracking-wider text-studio-textMuted hover:text-studio-gold transition-colors"
                  >
                    Portfolio
                  </Link>
                  <button
                    onClick={() => handleBookArtist(artist)}
                    className="bg-gradient-to-r from-studio-bronze to-amber-700 hover:from-amber-600 hover:to-studio-bronze text-white px-4 py-2 text-[11px] font-bold font-display uppercase tracking-wider rounded transition-all shadow-md hover:scale-[1.02] border border-amber-400/30"
                  >
                    Consult
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
