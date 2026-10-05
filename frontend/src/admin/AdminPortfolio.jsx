import React, { useState, useEffect } from 'react';
import { portfolioAPI, uploadAPI } from '../services/api';
import { Plus, Edit, Trash2, Image, Upload, Star, Eye, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const AdminPortfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('Sacred Devbhoomi & Geometry');
  const [artistName, setArtistName] = useState('Land of God Tattoo Studio');
  const [bodyPlacement, setBodyPlacement] = useState('Forearm');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const pRes = await portfolioAPI.getAll({ limit: 100 });
      if (pRes.success) setPortfolio(pRes.portfolio || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load portfolio gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = () => {
      setCoverImage(reader.result);
      toast.success('Tattoo photo loaded and ready to save!');
      setUploadingImage(false);
    };
    reader.onerror = () => {
      toast.error('Failed to process image file');
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setStyle('Sacred Devbhoomi & Geometry');
    setArtistName('Land of God Tattoo Studio');
    setBodyPlacement('Forearm');
    setCoverImage('https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80');
    setTags('Mahadev, Sacred Geometry, Devbhoomi, Fine Line');
    setIsFeatured(false);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description || '');
    setStyle(item.style || 'Custom');
    setArtistName(item.artistName || item.artist?.name || 'Land of God Tattoo Studio');
    setBodyPlacement(item.bodyPlacement || 'General');
    setCoverImage(item.coverImage);
    setTags((item.tags || []).join(', '));
    setIsFeatured(Boolean(item.isFeatured));
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !coverImage) {
      toast.error('Please provide a title and tattoo photo');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title,
        description,
        style,
        artistName,
        bodyPlacement,
        coverImage,
        images: [coverImage],
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        isFeatured: Boolean(isFeatured),
      };

      if (editingItem) {
        await portfolioAPI.update(editingItem._id, payload);
        toast.success(`Tattoo piece "${title}" updated!`);
      } else {
        await portfolioAPI.create(payload);
        toast.success(`Masterpiece "${title}" added to gallery!`);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, pieceTitle) => {
    if (!window.confirm(`Permanently remove "${pieceTitle}" from public portfolio?`)) return;
    try {
      await portfolioAPI.delete(id);
      toast.success('Piece deleted');
      loadData();
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
            Tattoo Portfolio &amp; Master Gallery
          </h1>
          <p className="text-xs text-studio-textMuted">
            Upload studio tattoo artworks, assign body placement &amp; styles. All updates appear immediately on the public site.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-studio-bronze hover:bg-studio-bronzeLight text-studio-darker font-condensed font-bold px-4 py-2 text-xs uppercase tracking-wider rounded shadow-bronze flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Tattoo Piece</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-studio-textMuted">Loading portfolio collection...</div>
      ) : portfolio.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-xl border border-studio-border/40 text-studio-textMuted text-xs">
          No tattoo artworks in portfolio. Click "Upload New Tattoo Piece" above to add your first photo.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {portfolio.map((item) => (
            <div
              key={item._id}
              className="glass-card rounded-xl overflow-hidden border border-studio-border/50 shadow-xl flex flex-col justify-between"
            >
              <div className="relative h-64 overflow-hidden bg-studio-card group">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 bg-studio-darker/90 text-[10px] font-bold text-studio-gold uppercase px-2 py-0.5 rounded border border-studio-gold/30">
                  {item.bodyPlacement || 'Body'}
                </span>
                <span className="absolute top-2.5 right-2.5 bg-studio-card/90 text-[10px] font-bold text-studio-textMain px-2 py-0.5 rounded border border-studio-border/40">
                  {item.style || 'Custom'}
                </span>
                {item.isFeatured && (
                  <span className="absolute bottom-2.5 left-2.5 bg-amber-500 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded flex items-center space-x-1">
                    <Star className="w-2.5 h-2.5 fill-black" />
                    <span>Featured</span>
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-condensed font-bold text-base text-studio-textMain uppercase">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-studio-gold font-semibold">
                    {item.artistName || item.artist?.name || 'Land of God Studio'}
                  </p>
                  {item.description && (
                    <p className="text-xs text-studio-textMuted mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-studio-border/30 flex items-center justify-between">
                  <span className="text-[10px] text-studio-textMuted">
                    {item.views || 0} views
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded border border-studio-border hover:border-studio-bronze text-studio-bronzeLight"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, item.title)}
                      className="p-1.5 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-xl w-full bg-studio-card border border-studio-border rounded-xl p-6 shadow-2xl space-y-4 my-8">
            <h3 className="font-condensed font-bold text-2xl text-studio-textMain uppercase">
              {editingItem ? 'Edit Tattoo Artwork' : 'Upload Tattoo Artwork to Gallery'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs">
              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">Tattoo Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahadev Trishul & Sacred Geometry Full Sleeve"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-studio-textMuted uppercase mb-1">Tattoo Style</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                  >
                    <option value="Sacred Devbhoomi & Geometry">Sacred Devbhoomi & Geometry</option>
                    <option value="Mahadev & Spiritual">Mahadev & Spiritual</option>
                    <option value="Realism">Realism</option>
                    <option value="Fine Line & Vedic Script">Fine Line & Vedic Script</option>
                    <option value="Blackwork">Blackwork</option>
                    <option value="Watercolor">Watercolor</option>
                    <option value="Sleeve">Sleeve</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Traditional">Traditional</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-studio-textMuted uppercase mb-1">Body Placement</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Forearm, Full Back, Chest, Shoulder"
                    value={bodyPlacement}
                    onChange={(e) => setBodyPlacement(e.target.value)}
                    className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">Studio / Artist Credit</label>
                <input
                  type="text"
                  placeholder="e.g. Land of God Tattoo Studio / Master Sunil"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                />
              </div>

              {/* Image Upload / URL */}
              <div className="space-y-2 border border-studio-border/50 bg-studio-secondary/60 p-3 rounded-lg">
                <label className="block font-bold text-studio-textMuted uppercase">Tattoo Image</label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      required
                      placeholder="Image URL (e.g. https://...)"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="w-full bg-studio-card border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                    />
                  </div>
                  <div className="shrink-0 flex items-center space-x-2">
                    <label className="cursor-pointer bg-studio-card border border-studio-border hover:border-studio-gold text-studio-gold px-3 py-2 rounded flex items-center space-x-1.5 text-xs font-semibold">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {coverImage && (
                  <div className="mt-2 relative w-32 h-32 rounded-lg overflow-hidden border border-studio-gold/40">
                    <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Details about the composition, spiritual symbolism, needle gauge..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-bold text-studio-textMuted uppercase mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Mahadev, Trishul, Una, Sacred"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-4">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-studio-gold focus:ring-studio-gold accent-amber-500"
                  />
                  <label htmlFor="isFeatured" className="font-bold text-studio-textMain cursor-pointer">
                    Feature on Homepage Hero &amp; Gallery
                  </label>
                </div>
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
                  {submitting ? 'Saving...' : 'Save Tattoo Artwork'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
