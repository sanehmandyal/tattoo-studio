import React, { useState, useEffect } from 'react';
import { reviewsAPI } from '../services/api';
import { Plus, Trash2, Star, MessageSquare, CheckCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [clientName, setClientName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [tattooStyle, setTattooStyle] = useState('Mahadev Sacred Geometry');
  const [source, setSource] = useState('Google Verified Review');
  const [avatar, setAvatar] = useState('');

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewsAPI.getAll({ limit: 50 });
      if (res.success) {
        setReviews(res.reviews || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const openModal = () => {
    setClientName('');
    setRating(5);
    setReviewText('');
    setTattooStyle('Mahadev Sacred Geometry');
    setSource('Google Verified Review');
    setAvatar('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || !reviewText) {
      toast.error('Please provide client name and testimonial text');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        clientName,
        rating: Number(rating),
        reviewText,
        tattooStyle,
        source,
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(clientName)}&background=181512&color=d4a359`,
        isApproved: true,
      };

      await reviewsAPI.create(payload);
      toast.success(`Review from ${clientName} published successfully!`);
      setModalOpen(false);
      loadReviews();
    } catch (err) {
      toast.error(err.message || 'Failed to publish review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete review from "${name}"?`)) return;
    try {
      await reviewsAPI.delete(id);
      toast.success('Review deleted');
      loadReviews();
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-studio-border/30 pb-4">
        <div>
          <h1 className="font-condensed font-black text-3xl uppercase tracking-wider text-studio-textMain">
            Client Reviews &amp; Testimonials
          </h1>
          <p className="text-xs text-studio-textMuted">
            Manage Google 5-star ratings, client testimonials, and studio reputation scores displayed across the website.
          </p>
        </div>
        <button
          onClick={openModal}
          className="bg-studio-bronze hover:bg-studio-bronzeLight text-studio-darker font-condensed font-bold px-4 py-2 text-xs uppercase tracking-wider rounded shadow-bronze flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client Review</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-studio-textMuted">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-xl border border-studio-border/40 text-studio-textMuted text-xs">
          No reviews found. Click "+ Add Client Review" above to add the studio's first testimonial.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="glass-card rounded-xl p-5 border border-studio-border/50 shadow-xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={r.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.clientName || 'Client')}&background=181512&color=d4a359`}
                      alt={r.clientName}
                      className="w-10 h-10 rounded-full border border-studio-gold/30 object-cover"
                    />
                    <div>
                      <h4 className="font-condensed font-bold text-sm text-studio-textMain uppercase">
                        {r.clientName}
                      </h4>
                      <p className="text-[10px] text-studio-gold font-semibold flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3 text-studio-gold" />
                        <span>{r.source || 'Verified Client'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-0.5 text-studio-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < (r.rating || 5) ? 'fill-studio-gold text-studio-gold' : 'text-studio-border'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-studio-textMuted italic leading-relaxed">
                  "{r.reviewText}"
                </p>

                {r.tattooStyle && (
                  <div className="inline-block bg-studio-card/80 border border-studio-border/50 text-[10px] text-studio-bronzeLight font-semibold px-2 py-0.5 rounded">
                    Tattoo: {r.tattooStyle}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-studio-border/30 flex items-center justify-between text-[11px] text-studio-textMuted">
                <span>{new Date(r.createdAt || Date.now()).toLocaleDateString()}</span>
                <button
                  onClick={() => handleDelete(r._id, r.clientName)}
                  className="p-1.5 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10"
                  title="Delete review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-lg w-full bg-studio-card border border-studio-border rounded-xl p-6 shadow-2xl space-y-4 my-8">
            <h3 className="font-condensed font-bold text-2xl text-studio-textMain uppercase">
              Publish Client Review / Testimonial
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs">
              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-studio-textMuted uppercase mb-1">Rating (Stars)</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5 Stars (Flawless)</option>
                    <option value={4}>⭐⭐⭐⭐ 4 Stars (Excellent)</option>
                    <option value={3}>⭐⭐⭐ 3 Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-studio-textMuted uppercase mb-1">Source</label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g. Google Verified, Direct Client"
                    className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">Tattoo Style / Design Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mahadev Trishul Sleeve, Devbhoomi Mandala"
                  value={tattooStyle}
                  onChange={(e) => setTattooStyle(e.target.value)}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                />
              </div>

              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">Client Avatar / Photo URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                />
              </div>

              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">Testimonial Review Text</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Describe the client's experience, sterile setup, precision needlework, and healing outcome..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-studio-border/30">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-studio-textMuted hover:text-studio-textMain"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-studio-bronze hover:bg-studio-bronzeLight text-studio-darker font-bold px-5 py-2 uppercase tracking-wider rounded shadow-bronze"
                >
                  {submitting ? 'Publishing...' : 'Publish Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
