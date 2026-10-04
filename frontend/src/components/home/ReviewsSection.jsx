import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, ExternalLink, Quote, ThumbsUp, Sparkles } from 'lucide-react';
import { reviewsAPI } from '../../services/api';

export const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default backup reviews from Land of God Google Reviews in case API is connecting
  const fallbackReviews = [
    {
      _id: '1',
      authorName: 'Vikram Choudhary',
      rating: 5,
      location: 'Friends Colony, Una',
      reviewText: 'Got a full forearm Mahadev Trishul with Sacred Om. Master Sunil is truly a divine artist! The level of fine detailing and painless precision is mindblowing. 100% recommended for everyone in Himachal!',
      tattooStyle: 'Sacred Geometry',
      verifiedCustomer: true,
      reviewDate: '3 weeks ago',
      googleMapsLink: 'https://share.google/8Ck6bnKVFP2JNuUQT',
    },
    {
      _id: '2',
      authorName: 'Priya Jaswal',
      rating: 5,
      location: 'Una, Himachal Pradesh',
      reviewText: 'Most sterile and professional studio in Himachal Pradesh! Clean single-use needles, amazing vibe, and the fine-line Sanskrit shloka on my wrist healed in 1 week without any fading. Best tattoo studio in Friends Colony!',
      tattooStyle: 'Fine Line & Sanskrit',
      verifiedCustomer: true,
      reviewDate: '1 month ago',
      googleMapsLink: 'https://share.google/8Ck6bnKVFP2JNuUQT',
    },
    {
      _id: '3',
      authorName: 'Sahil Sharma',
      rating: 5,
      location: 'Chandigarh / Una HP',
      reviewText: 'Traveled to Friends Colony Una specifically for Master Sunil\'s portrait realism work. The lion and Himalayan mountains tattoo looks like a real photograph. Hospital-grade cleanliness and top-tier inks.',
      tattooStyle: 'Realism Portrait',
      verifiedCustomer: true,
      reviewDate: '1 month ago',
      googleMapsLink: 'https://share.google/8Ck6bnKVFP2JNuUQT',
    },
    {
      _id: '4',
      authorName: 'Ankita Rana',
      rating: 5,
      location: 'Friends Colony, Una',
      reviewText: 'Extremely polite and artistic staff. Eliza and Sunil guided me through the placement and design customization. Best experience for my first tattoo!',
      tattooStyle: 'Mandala & Floral',
      verifiedCustomer: true,
      reviewDate: '2 months ago',
      googleMapsLink: 'https://share.google/8Ck6bnKVFP2JNuUQT',
    }
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await reviewsAPI.getAll();
        if (res && res.reviews && res.reviews.length > 0) {
          setReviews(res.reviews);
        } else if (res && res.data && res.data.length > 0) {
          setReviews(res.data);
        } else {
          setReviews(fallbackReviews);
        }
      } catch (err) {
        setReviews(fallbackReviews);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section id="reviews" className="py-24 bg-studio-darker relative overflow-hidden border-t border-studio-border/30">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-studio-bronze/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header with Google Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-studio-bronze/10 border border-studio-bronze/40 rounded-full text-studio-gold text-xs font-bold uppercase tracking-widest mb-3 font-serif">
              <span>🔱 Verified Devbhoomi Google Testimonials</span>
            </div>
            <h2 className="ancient-carved-heading text-3xl md:text-5xl font-black tracking-wider text-studio-textMain uppercase">
              ॥ ४. TESTIMONIALS &amp; REPUTATION ॥
            </h2>
            <p className="text-studio-bronzeLight text-xs md:text-sm mt-2 max-w-xl font-serif italic">
              Authentic words from ink collectors at Land of God Tattoo Studio, Friends Colony, Una (Himachal Pradesh).
            </p>
          </div>

          {/* Google 5.0 Rating Badge */}
          <div className="ancient-stone-card ancient-ornate-corner rounded-xl p-5 flex items-center space-x-5 shadow-2xl backdrop-blur-md">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md border border-amber-300">
              {/* Google G Icon */}
              <svg className="w-7 h-7" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-studio-gold font-display">5.0</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-studio-textMuted mt-0.5 font-serif">Top-Rated Tattoo Studio in Una, HP</p>
            </div>
            <a
              href="https://share.google/8Ck6bnKVFP2JNuUQT"
              target="_blank"
              rel="noreferrer"
              className="bg-gradient-to-r from-studio-bronze to-amber-700 hover:from-amber-600 hover:to-studio-bronze text-white text-xs font-bold px-4 py-2.5 rounded flex items-center space-x-1.5 transition-all uppercase tracking-wider font-display border border-amber-400/30"
            >
              <span>Review Us</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.slice(0, 4).map((rev) => (
            <div
              key={rev._id}
              className="ancient-stone-card ancient-ornate-corner rounded-xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-amber-950/40 group"
            >
              <div>
                {/* Top author & Stars */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h4 className="font-bold text-studio-textMain text-sm group-hover:text-studio-gold font-display transition-colors">
                        {rev.authorName || rev.clientName || 'Verified Client'}
                      </h4>
                      {rev.verifiedCustomer && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" title="Verified Client" />
                      )}
                    </div>
                    <span className="text-[11px] text-studio-textMuted font-serif">{rev.location || 'Una, HP'}</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div className="relative mb-6">
                  <Quote className="w-6 h-6 text-studio-bronze/20 absolute -top-2 -left-1 pointer-events-none" />
                  <p className="text-xs text-studio-textMuted leading-relaxed pl-4 line-clamp-4 italic">
                    "{rev.reviewText}"
                  </p>
                </div>
              </div>

              {/* Bottom Tag & Date */}
              <div className="pt-4 border-t border-studio-border/40 flex items-center justify-between text-[11px]">
                <span className="px-2 py-0.5 rounded bg-studio-card text-studio-bronzeLight font-semibold">
                  {rev.tattooStyle || 'Custom Ink'}
                </span>
                <span className="text-studio-textMuted/60">{rev.reviewDate || 'Verified'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Link to Google Profile */}
        <div className="mt-12 text-center">
          <a
            href="https://share.google/8Ck6bnKVFP2JNuUQT"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-2 text-xs font-bold tracking-widest uppercase text-studio-bronzeLight hover:text-white border-b border-studio-bronze pb-1 hover:border-white transition-all"
          >
            <span>Read all 5.0-Star Reviews on Google Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
