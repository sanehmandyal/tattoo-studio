import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { artistsAPI, portfolioAPI } from '../services/api';
import { Star, Instagram, Calendar, ShieldCheck, ArrowLeft, Heart } from 'lucide-react';

export const ArtistDetailPage = () => {
  const { slugOrId } = useParams();
  const [artist, setArtist] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const res = await artistsAPI.getBySlug(slugOrId);
        if (res.success) {
          setArtist(res.artist);
          const portRes = await portfolioAPI.getAll({ artist: res.artist._id });
          if (portRes.success) setPortfolio(portRes.portfolio);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtist();
  }, [slugOrId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 text-center text-studio-textMuted bg-studio-bg">
        Loading artist profile...
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen pt-32 text-center text-studio-textMuted bg-studio-bg space-y-4">
        <h2 className="text-2xl font-bold text-studio-textMain">Artist Not Found</h2>
        <Link to="/artists" className="text-studio-bronzeLight hover:underline">
          ← Back to All Artists
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-studio-bg lg:pl-12">
      <Helmet>
        <title>{artist.name} — Master Tattoo Artist | INK CARVERS</title>
        <meta name="description" content={`${artist.name} - ${artist.title}. ${artist.bio}`} />
      </Helmet>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        <Link
          to="/artists"
          className="inline-flex items-center space-x-2 text-xs font-bold text-studio-textMuted hover:text-studio-bronzeLight uppercase tracking-wider mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Master Roster</span>
        </Link>

        {/* Profile Showcase Card */}
        <div className="glass-panel-dark rounded-2xl p-6 sm:p-10 border border-studio-border/60 shadow-2xl mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4">
              <div className="relative rounded-xl overflow-hidden border border-studio-border h-96 shadow-2xl bg-studio-card">
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            <div className="md:col-span-8 space-y-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xs uppercase tracking-widest font-bold text-studio-bronzeLight">
                    Master Resident
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-studio-gold">
                    <Star className="w-3.5 h-3.5 fill-studio-gold" />
                    <span>{artist.rating || 4.9} Rating</span>
                  </div>
                </div>
                <h1 className="font-condensed font-black text-4xl sm:text-5xl uppercase tracking-tight text-studio-textMain">
                  {artist.name}
                </h1>
                <p className="text-sm text-studio-bronzeLight font-medium mt-1">
                  {artist.title}
                </p>
              </div>

              <p className="text-sm text-studio-textMuted leading-relaxed">
                {artist.bio}
              </p>

              <div className="flex flex-wrap gap-2">
                {(artist.specializations || []).map((spec, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-studio-card text-studio-bronzeLight border border-studio-border/40"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-studio-border/30 flex flex-wrap items-center gap-4">
                <Link
                  to={`/booking?artistId=${artist._id}&artistName=${encodeURIComponent(artist.name)}`}
                  className="bg-gradient-to-r from-studio-bronze to-amber-700 hover:from-amber-600 hover:to-studio-bronze text-white font-display font-bold px-6 py-3 text-xs uppercase tracking-[0.2em] rounded-lg shadow-md transition-all border border-amber-400/30"
                >
                  Book Session with {artist.name}
                </Link>

                <a
                  href={`https://wa.me/917807966080?text=${encodeURIComponent(`🔱 *LAND OF GOD TATTOO STUDIO (UNA)*\n\nHello! I would like to consult with *${artist.name}* regarding a custom tattoo at your Friends Colony studio.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 px-5 py-3 text-xs font-bold font-display uppercase tracking-wider rounded-lg flex items-center space-x-2 transition-all shadow-md"
                >
                  <span>💬 Chat on WhatsApp</span>
                </a>

                {artist.socialLinks?.instagram && (
                  <a
                    href={artist.socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-studio-border hover:border-studio-bronze text-studio-textMain px-4 py-3 text-xs font-semibold rounded flex items-center space-x-2 font-serif"
                  >
                    <Instagram className="w-4 h-4 text-studio-bronze" />
                    <span>Instagram</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Artist Custom Portfolio Gallery */}
        <div className="space-y-6">
          <h2 className="font-condensed text-3xl font-black text-studio-textMain uppercase tracking-wider">
            {artist.name}’s Signature Gallery
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.length === 0 ? (
              <div className="col-span-full py-12 text-center text-xs text-studio-textMuted">
                No portfolio uploads linked to this artist yet.
              </div>
            ) : (
              portfolio.map((item) => (
                <div
                  key={item._id}
                  className="glass-card rounded-xl overflow-hidden border border-studio-border/40 group shadow-xl"
                >
                  <div className="relative h-72 overflow-hidden bg-studio-card">
                    <img
                      src={item.coverImage || item.images?.[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-studio-card via-transparent to-transparent opacity-80" />
                    <span className="absolute top-3 left-3 bg-studio-darker/80 text-[10px] font-bold text-studio-bronzeLight uppercase px-2 py-0.5 rounded border border-studio-border/40">
                      {item.bodyPlacement}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-condensed font-bold text-lg text-studio-textMain uppercase">
                      {item.title}
                    </h3>
                    <p className="text-xs text-studio-textMuted mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
