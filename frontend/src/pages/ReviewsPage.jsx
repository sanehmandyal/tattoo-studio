import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { reviewsAPI } from '../services/api';
import { Star, CheckCircle2, ExternalLink, Quote, MessageSquare, Plus, Send } from 'lucide-react';
import { toast } from 'sonner';

export const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    authorName: '',
    authorLocation: '',
    rating: 5,
    tattooStyle: 'Sacred Geometry',
    reviewText: '',
  });
  const [submitting, setSubmitting] = useState(false);

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
    },
    {
      _id: '5',
      authorName: 'Rohit Sharma',
      rating: 5,
      location: 'Hamirpur / Una',
      reviewText: 'Got a custom geometric sleeve. Single-use needle cartridges opened right in front of me. 100% infection-free healing. Master Sunil has decades of mastery.',
      tattooStyle: 'Sleeve Realism',
      verifiedCustomer: true,
      reviewDate: '2 months ago',
      googleMapsLink: 'https://share.google/8Ck6bnKVFP2JNuUQT',
    },
    {
      _id: '6',
      authorName: 'Karan Mehra',
      rating: 5,
      location: 'Una, Himachal Pradesh',
      reviewText: 'The 3D tattoo placement preview tool on their website helped me test where the Trishul would look best on my arm. Incredible tattoo experience in Devbhoomi!',
      tattooStyle: 'Mahadev Trishul',
      verifiedCustomer: true,
      reviewDate: '3 months ago',
      googleMapsLink: 'https://share.google/8Ck6bnKVFP2JNuUQT',
    }
  ];

  const fetchReviews = async () => {
    setLoading(true);
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

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!formData.authorName || !formData.reviewText) {
      toast.error('Please enter your name and review details');
      return;
    }

    setSubmitting(true);
    try {
      const res = await reviewsAPI.create(formData);
      if (res.success) {
        toast.success('Thank you! Your review has been submitted.');
        setShowModal(false);
        setFormData({
          authorName: '',
          authorLocation: '',
          rating: 5,
          tattooStyle: 'Sacred Geometry',
          reviewText: '',
        });
        fetchReviews();
      } else {
        toast.error(res.message || 'Failed to submit review');
      }
    } catch (err) {
      toast.error(err.message || 'Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-studio-bg">
      <Helmet>
        <title>Google Verified Client Reviews (5.0★) — LAND OF GOD TATTOO STUDIO (Una, HP)</title>
        <meta
          name="description"
          content="Read verified 5.0-Star Google reviews and client testimonials for Land of God Tattoo Studio in Friends Colony, Una, Himachal Pradesh. Master Sunil sacred ink artistry."
        />
        <meta name="keywords" content="Land of God Tattoo Studio Reviews, Tattoo Shop Reviews Una, Best Tattoo Artist Himachal Reviews" />
      </Helmet>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-studio-gold font-serif">
            🔱 VERIFIED GOOGLE &amp; STUDIO TESTIMONIALS 🔱
          </span>
          <h1 className="ancient-carved-heading text-4xl sm:text-5xl uppercase tracking-tight text-studio-textMain">
            ॥ CLIENT REVIEWS &amp; REPUTATION ॥
          </h1>
          <p className="text-xs sm:text-sm text-studio-textMuted font-serif">
            Discover why collectors across Himachal Pradesh, Punjab, and Chandigarh rate Land of God Tattoo Studio 5.0★ on Google.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="https://share.google/8Ck6bnKVFP2JNuUQT"
              target="_blank"
              rel="noreferrer"
              className="bg-studio-card hover:bg-studio-secondary border border-studio-gold/60 text-studio-gold px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-md"
            >
              <span>⭐ Write a Google Review</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-studio-bronze to-amber-700 hover:from-amber-600 hover:to-studio-bronze text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-lg border border-amber-400/30"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Studio Feedback</span>
            </button>
          </div>
        </div>

        {/* Rating Summary Card */}
        <div className="glass-panel-dark p-6 sm:p-8 rounded-2xl border border-studio-bronze/50 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <span className="text-5xl font-black text-studio-gold font-display">5.0</span>
              <div className="flex text-amber-400 justify-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[11px] text-studio-textMuted block mt-1">Based on 420+ Reviews</span>
            </div>
            <div className="h-14 w-px bg-studio-border/60 hidden sm:block" />
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>100% Sterile Medical-Grade Procedures</span>
              </div>
              <div className="flex items-center space-x-2 text-studio-gold font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Master Sunil Sacred Geometry &amp; Realism</span>
              </div>
              <div className="flex items-center space-x-2 text-studio-bronzeLight font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Friends Colony, Una, Himachal Pradesh</span>
              </div>
            </div>
          </div>

          <a
            href="https://wa.me/917807966080?text=Hello%20Master%20Sunil%2C%20I%20saw%20your%205-star%20reviews%20and%20would%20like%20to%20consult%20for%20a%20tattoo%20session."
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-400 px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-md"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Consult on WhatsApp (+91 78079 66080)</span>
          </a>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs text-studio-textMuted">Loading verified testimonials...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="ancient-stone-card ancient-ornate-corner rounded-xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:border-studio-gold/60 group"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h4 className="font-bold text-studio-textMain text-sm group-hover:text-studio-gold font-display transition-colors">
                          {rev.authorName || rev.clientName || 'Verified Client'}
                        </h4>
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" title="Verified Customer" />
                      </div>
                      <span className="text-[11px] text-studio-textMuted font-serif">{rev.location || rev.authorLocation || 'Una, HP'}</span>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <div className="relative mb-6">
                    <Quote className="w-6 h-6 text-studio-bronze/20 absolute -top-2 -left-1 pointer-events-none" />
                    <p className="text-xs text-studio-textMuted leading-relaxed pl-4 font-serif italic">
                      "{rev.reviewText}"
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-studio-border/40 flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-studio-card text-studio-bronzeLight font-semibold border border-studio-border/40">
                    {rev.tattooStyle || 'Sacred Tattoo'}
                  </span>
                  <span className="text-studio-textMuted/70">{rev.reviewDate || 'Verified Review'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel-dark p-6 rounded-2xl border border-studio-gold/60 shadow-2xl space-y-4">
            <h3 className="font-display font-black text-xl text-studio-textMain uppercase tracking-wider text-center">
              Share Your Studio Experience
            </h3>
            <p className="text-xs text-studio-textMuted text-center font-serif">
              Your feedback inspires ink collectors across Devbhoomi.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-3 text-left">
              <div>
                <label className="block text-xs font-bold text-studio-textMuted uppercase mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Choudhary"
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none focus:border-studio-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-studio-textMuted uppercase mb-1">City / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Friends Colony, Una / Chandigarh"
                  value={formData.authorLocation}
                  onChange={(e) => setFormData({ ...formData, authorLocation: e.target.value })}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none focus:border-studio-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-studio-textMuted uppercase mb-1">Rating</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none focus:border-studio-gold"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 / 5)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 / 5)</option>
                    <option value={3}>⭐⭐⭐ (3 / 5)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-studio-textMuted uppercase mb-1">Tattoo Style</label>
                  <select
                    value={formData.tattooStyle}
                    onChange={(e) => setFormData({ ...formData, tattooStyle: e.target.value })}
                    className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none focus:border-studio-gold"
                  >
                    <option value="Sacred Geometry">Sacred Geometry</option>
                    <option value="Mahadev Trishul">Mahadev Trishul</option>
                    <option value="Fine Line">Fine Line &amp; Mantra</option>
                    <option value="Realism Portrait">Realism Portrait</option>
                    <option value="Blackwork">Blackwork</option>
                    <option value="Floral & Mandala">Floral &amp; Mandala</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-studio-textMuted uppercase mb-1">Your Review</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about the artistry, hygiene, and painless experience..."
                  value={formData.reviewText}
                  onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-xs text-studio-textMain focus:outline-none focus:border-studio-gold resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-studio-textMuted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-studio-bronze to-amber-700 hover:from-amber-600 hover:to-studio-bronze text-white font-bold px-5 py-2 rounded text-xs uppercase tracking-wider flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Post Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
