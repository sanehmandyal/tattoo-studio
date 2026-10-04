import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { artistsAPI } from '../services/api';
import { Star, Calendar, ArrowRight, Instagram, Sparkles, CheckCircle2 } from 'lucide-react';

export const ArtistsPage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await artistsAPI.getAll();
        if (res.success) setArtists(res.artists);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-studio-bg lg:pl-12">
      <Helmet>
        <title>Resident Master Tattoo Artists — INK CARVERS</title>
        <meta
          name="description"
          content="Meet our international award-winning master tattoo artists specializing in Realism, Fine Line, Sacred Geometry, Blackwork, and Watercolor."
        />
      </Helmet>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-studio-bronzeLight">
            Master Craftsmanship
          </span>
          <h1 className="font-condensed font-black text-4xl sm:text-5xl uppercase tracking-tight text-studio-textMain">
            Resident Tattoo Masters
          </h1>
          <p className="text-xs sm:text-sm text-studio-textMuted">
            Each resident artist brings decades of dedicated discipline, refined needle weight precision, and distinct signature aesthetics.
          </p>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <div
              key={artist._id}
              className="glass-card rounded-xl overflow-hidden border border-studio-border/50 hover:border-studio-bronze transition-all duration-300 flex flex-col justify-between group shadow-xl"
            >
              {/* Photo & Availability Tag */}
              <div className="relative h-80 overflow-hidden bg-studio-card">
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="w-full h-full object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-studio-card via-transparent to-transparent opacity-85" />
                
                <div className="absolute top-3 right-3 bg-studio-darker/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Available for Booking</span>
                </div>

                <div className="absolute bottom-3 left-4 flex items-center space-x-1 text-xs text-studio-gold">
                  <Star className="w-3.5 h-3.5 fill-studio-gold" />
                  <span className="font-bold">{artist.rating || 4.9}</span>
                  <span className="text-[10px] text-studio-textMuted">({artist.experienceYears || 8} yrs exp)</span>
                </div>
              </div>

              {/* Information */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h2 className="font-condensed font-black text-2xl tracking-wider text-studio-textMain uppercase group-hover:text-studio-bronzeLight transition-colors">
                    {artist.name}
                  </h2>
                  <p className="text-xs text-studio-bronzeLight font-medium mt-0.5">
                    {artist.title}
                  </p>
                  <p className="text-xs text-studio-textMuted mt-3 line-clamp-3 leading-relaxed">
                    {artist.bio}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(artist.specializations || []).map((spec, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-studio-secondary text-studio-textMuted border border-studio-border/30"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-studio-border/30 flex items-center justify-between">
                  <Link
                    to={`/artists/${artist.slug || artist._id}`}
                    className="text-xs font-bold text-studio-textMuted hover:text-studio-textMain transition-colors"
                  >
                    View Biography &amp; Work
                  </Link>
                  <Link
                    to={`/booking?artistId=${artist._id}&artistName=${encodeURIComponent(artist.name)}`}
                    className="bg-studio-bronze hover:bg-studio-bronzeLight text-studio-darker px-4 py-2 text-[11px] font-bold font-condensed uppercase tracking-wider rounded transition-all shadow-bronze"
                  >
                    Book Session
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
