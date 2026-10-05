import React, { useState, useEffect } from 'react';
import { artistsAPI } from '../services/api';
import { Plus, Edit, Trash2, Check, X, Star, Upload, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cleanImageUrl, compressImageFile, getFullImageUrl } from '../utils/imageHelper';

export const AdminArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [title, setTitle] = useState('Resident Master Tattooist');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [specializations, setSpecializations] = useState('');
  const [avatar, setAvatar] = useState('');
  const [instagram, setInstagram] = useState('');
  const [rating, setRating] = useState(4.9);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState(false);

  const loadArtists = async () => {
    setLoading(true);
    try {
      const res = await artistsAPI.getAll(true);
      if (res.success) setArtists(res.artists);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load artists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArtists();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const compressedDataUrl = await compressImageFile(file, { maxWidth: 1000, maxHeight: 1000, quality: 0.85 });
      setAvatar(compressedDataUrl);
      setImageError(false);
      toast.success('Artist photo optimized and ready to save!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to process image file');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const openCreateModal = () => {
    setEditingArtist(null);
    setName('');
    setTitle('Resident Master Tattooist');
    setBio('');
    setExperienceYears(5);
    setSpecializations('Realism, Fine Line');
    setAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80');
    setInstagram('');
    setRating(4.9);
    setImageError(false);
    setModalOpen(true);
  };

  const openEditModal = (artist) => {
    setEditingArtist(artist);
    setName(artist.name);
    setTitle(artist.title || '');
    setBio(artist.bio);
    setExperienceYears(artist.experienceYears || 5);
    setSpecializations((artist.specializations || []).join(', '));
    setAvatar(artist.avatar);
    setInstagram(artist.socialLinks?.instagram || '');
    setRating(artist.rating || 4.9);
    setImageError(false);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !bio || !avatar) {
      toast.error('Please fill required fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        title,
        bio,
        experienceYears: Number(experienceYears),
        specializations: specializations.split(',').map(s => s.trim()).filter(Boolean),
        avatar,
        socialLinks: { instagram },
        rating: Number(rating),
      };

      if (editingArtist) {
        await artistsAPI.update(editingArtist._id, payload);
        toast.success(`Artist "${name}" updated successfully!`);
      } else {
        await artistsAPI.create(payload);
        toast.success(`Artist "${name}" added to master roster!`);
      }
      setModalOpen(false);
      loadArtists();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (artistId, artistName) => {
    if (!window.confirm(`Are you sure you want to remove ${artistName}?`)) return;
    try {
      await artistsAPI.delete(artistId);
      toast.success('Artist removed');
      loadArtists();
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
            Master Artists Directory
          </h1>
          <p className="text-xs text-studio-textMuted">
            Configure resident artists, bios, experience metrics, and portfolio links.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-studio-bronze hover:bg-studio-bronzeLight text-white font-condensed font-bold px-4 py-2 text-xs uppercase tracking-wider rounded shadow-bronze flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Master Artist</span>
        </button>
      </div>

      {/* Artists Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-studio-textMuted">Loading artists...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <div
              key={artist._id}
              className="glass-card rounded-xl overflow-hidden border border-studio-border/50 shadow-xl flex flex-col justify-between"
            >
              <div className="relative h-64 overflow-hidden bg-studio-card">
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-studio-card via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 right-3 bg-studio-darker/80 text-[10px] font-bold text-studio-gold px-2 py-0.5 rounded border border-studio-border/40 flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-studio-gold" />
                  <span>{artist.rating}</span>
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-condensed font-bold text-xl text-studio-textMain uppercase">
                    {artist.name}
                  </h3>
                  <p className="text-xs text-studio-bronzeLight font-medium">
                    {artist.title} ({artist.experienceYears} yrs)
                  </p>
                  <p className="text-xs text-studio-textMuted mt-2 line-clamp-2">
                    {artist.bio}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {(artist.specializations || []).map((spec, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-studio-secondary text-studio-textMuted border border-studio-border/30">
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-studio-border/30 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">● Active</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditModal(artist)}
                      className="p-1.5 rounded border border-studio-border hover:border-studio-bronze text-studio-bronzeLight"
                      title="Edit Artist"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(artist._id, artist.name)}
                      className="p-1.5 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10"
                      title="Delete Artist"
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

      {/* Artist Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-lg w-full bg-studio-card border border-studio-border rounded-xl p-6 shadow-2xl space-y-4 my-8">
            <h3 className="font-condensed font-bold text-2xl text-studio-textMain uppercase">
              {editingArtist ? 'Edit Master Artist' : 'Add New Master Artist'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-left text-xs">
              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">Artist Full Name / Moniker</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ELIZA or LIAM"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                />
              </div>

              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">Professional Title</label>
                <input
                  type="text"
                  placeholder="e.g. Master Fine-Line & Botanical Realism"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                />
              </div>

              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">Biography</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Artist background, training, and technique..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-studio-textMuted uppercase mb-1">Years Experience</label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                  />
                </div>
                <div>
                  <label className="block font-bold text-studio-textMuted uppercase mb-1">Rating (1-5)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">Specializations (comma separated)</label>
                <input
                  type="text"
                  placeholder="Realism, Fine Line, Sacred Geometry"
                  value={specializations}
                  onChange={(e) => setSpecializations(e.target.value)}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                />
              </div>

              {/* Artist Avatar Image Upload / URL */}
              <div className="space-y-2 border border-studio-border/50 bg-studio-secondary/60 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-studio-textMuted uppercase">Artist Profile Photo</label>
                  <span className="text-[10px] text-studio-textMuted">File Upload or Photo Link</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      required
                      placeholder="Paste Image URL, Google Drive or Unsplash link..."
                      value={avatar}
                      onChange={(e) => {
                        const cleaned = cleanImageUrl(e.target.value);
                        setAvatar(cleaned);
                        setImageError(false);
                      }}
                      className="w-full bg-studio-card border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze text-xs"
                    />
                  </div>
                  <div className="shrink-0">
                    <label className="cursor-pointer bg-studio-card border border-studio-border hover:border-studio-gold text-studio-gold px-3 py-2 rounded flex items-center space-x-1.5 text-xs font-semibold">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Optimizing...' : 'Upload Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {avatar && (
                  <div className="mt-3 flex items-center space-x-3 p-2 bg-studio-dark/60 rounded-lg border border-studio-border/40">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-studio-gold/60 bg-black shrink-0 flex items-center justify-center">
                      {imageError ? (
                        <div className="flex flex-col items-center justify-center text-center p-1 text-red-400 text-[9px]">
                          <AlertCircle className="w-4 h-4 mb-0.5 opacity-80" />
                          <span>Error</span>
                        </div>
                      ) : (
                        <img
                          src={getFullImageUrl(avatar)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
                        />
                      )}
                    </div>
                    <div className="text-[11px] text-studio-textMuted space-y-1 overflow-hidden">
                      <p className="font-semibold text-studio-gold flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{imageError ? 'Photo Load Warning' : 'Photo Preview Active'}</span>
                      </p>
                      <p className="line-clamp-2 break-all text-[10px]">
                        {avatar.startsWith('data:') ? '✓ High-Resolution Local Upload' : avatar}
                      </p>
                      {imageError && (
                        <p className="text-red-400 text-[10px]">
                          Tip: Use 'Upload Photo' or check link validity.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">Instagram Profile URL (optional)</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/artist"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
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
                  {submitting ? 'Saving...' : 'Save Artist Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
