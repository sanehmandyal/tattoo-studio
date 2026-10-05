import React, { useState, useEffect } from 'react';
import { designsAPI, uploadAPI } from '../services/api';
import { Plus, Edit, Trash2, Sparkles, Upload, Eye, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cleanImageUrl, compressImageFile, getFullImageUrl } from '../utils/imageHelper';

export const AdminDesigns = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDesign, setEditingDesign] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [style, setStyle] = useState('Geometric');
  const [bodyAreas, setBodyAreas] = useState('Forearm, Upper Arm');
  const [description, setDescription] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [estTimeHours, setEstTimeHours] = useState(3);
  const [estPriceRange, setEstPriceRange] = useState('₹3,500 - ₹6,500');
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState(false);

  const loadDesigns = async () => {
    setLoading(true);
    try {
      const res = await designsAPI.getAll();
      if (res.success) setDesigns(res.designs || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load 3D designs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDesigns();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const compressedDataUrl = await compressImageFile(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.85 });
      setPreviewImage(compressedDataUrl);
      setImageError(false);
      toast.success('Design motif optimized and ready to save!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to process image file');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const openCreateModal = () => {
    setEditingDesign(null);
    setName('');
    setStyle('Geometric');
    setBodyAreas('Forearm, Upper Arm, Chest');
    setDescription('');
    setPreviewImage('https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=500&q=80');
    setDifficulty('Intermediate');
    setEstTimeHours(3);
    setEstPriceRange('₹3,500 - ₹6,500');
    setImageError(false);
    setModalOpen(true);
  };

  const openEditModal = (design) => {
    setEditingDesign(design);
    setName(design.name);
    setStyle(design.style);
    setBodyAreas((design.bodyAreas || []).join(', '));
    setDescription(design.description);
    setPreviewImage(design.previewImage);
    setDifficulty(design.difficulty || 'Intermediate');
    setEstTimeHours(design.estTimeHours || 3);
    setEstPriceRange(design.estPriceRange || '₹3,500 - ₹6,500');
    setImageError(false);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !previewImage || !description) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        style,
        bodyAreas: bodyAreas.split(',').map(b => b.trim()).filter(Boolean),
        description,
        previewImage,
        transparentOverlay: previewImage,
        difficulty,
        estTimeHours: Number(estTimeHours),
        estPriceRange,
      };

      if (editingDesign) {
        await designsAPI.update(editingDesign._id, payload);
        toast.success(`3D Design "${name}" updated!`);
      } else {
        await designsAPI.create(payload);
        toast.success(`New 3D design "${name}" added to Placement Lab!`);
      }
      setModalOpen(false);
      loadDesigns();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, designName) => {
    if (!window.confirm(`Delete 3D motif "${designName}"?`)) return;
    try {
      await designsAPI.delete(id);
      toast.success('Design motif removed');
      loadDesigns();
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
            3D Placement Tattoo Flash &amp; Motifs
          </h1>
          <p className="text-xs text-studio-textMuted">
            Manage interactive designs that clients can test on the 3D muscular body model on the homepage.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-studio-bronze hover:bg-studio-bronzeLight text-studio-darker font-condensed font-bold px-4 py-2 text-xs uppercase tracking-wider rounded shadow-bronze flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add 3D Tattoo Motif</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-studio-textMuted">Loading 3D catalog...</div>
      ) : designs.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-xl border border-studio-border/40 text-studio-textMuted text-xs">
          No 3D flash designs in database yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {designs.map((design) => (
            <div
              key={design._id}
              className="glass-card rounded-xl overflow-hidden border border-studio-border/50 shadow-xl flex flex-col justify-between"
            >
              <div className="relative h-56 bg-black/70 flex items-center justify-center p-4 group">
                <img
                  src={design.previewImage}
                  alt={design.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-2.5 left-2.5 bg-studio-darker/90 text-[10px] font-bold text-studio-gold uppercase px-2 py-0.5 rounded border border-studio-gold/30">
                  {design.style}
                </span>
                <span className="absolute top-2.5 right-2.5 bg-studio-card text-[10px] font-bold text-studio-textMain px-2 py-0.5 rounded">
                  {design.difficulty}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-condensed font-bold text-base text-studio-textMain uppercase">
                    {design.name}
                  </h3>
                  <div className="text-[11px] text-emerald-400 font-bold flex items-center space-x-1">
                    <span>💬 WhatsApp Inquiry • ~{design.estTimeHours || 2} hrs</span>
                  </div>
                  <p className="text-xs text-studio-textMuted mt-1 line-clamp-2">
                    {design.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-studio-border/30 flex items-center justify-between">
                  <span className="text-[10px] text-studio-textMuted truncate max-w-[120px]">
                    {(design.bodyAreas || []).join(', ')}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditModal(design)}
                      className="p-1.5 rounded border border-studio-border hover:border-studio-bronze text-studio-bronzeLight"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(design._id, design.name)}
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
          <div className="max-w-lg w-full bg-studio-card border border-studio-border rounded-xl p-6 shadow-2xl space-y-4 my-8">
            <h3 className="font-condensed font-bold text-2xl text-studio-textMain uppercase">
              {editingDesign ? 'Edit 3D Flash Motif' : 'Add New 3D Flash Motif'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs">
              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">Motif Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahadev Trishul & Sacred Om"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-studio-textMuted uppercase mb-1">Style</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                  >
                    <option value="Geometric">Geometric</option>
                    <option value="Sacred Devbhoomi">Sacred Devbhoomi</option>
                    <option value="Minimalist">Minimalist</option>
                    <option value="Fine Line">Fine Line</option>
                    <option value="Blackwork">Blackwork</option>
                    <option value="Traditional">Traditional</option>
                    <option value="Watercolor">Watercolor</option>
                    <option value="Script">Script</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-studio-textMuted uppercase mb-1">Complexity</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                  >
                    <option value="Simple">Simple</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Complex">Complex</option>
                    <option value="Masterpiece">Masterpiece</option>
                  </select>
                </div>
              </div>

              {/* Upload Motif Image */}
              <div className="space-y-2 border border-studio-border/50 bg-studio-secondary/60 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-studio-textMuted uppercase">Flash Design Artwork / PNG</label>
                  <span className="text-[10px] text-studio-textMuted">Transparent PNG or Flash Photo</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      required
                      placeholder="Paste Image URL, Google Drive or Unsplash link..."
                      value={previewImage}
                      onChange={(e) => {
                        const cleaned = cleanImageUrl(e.target.value);
                        setPreviewImage(cleaned);
                        setImageError(false);
                      }}
                      className="w-full bg-studio-card border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze text-xs"
                    />
                  </div>
                  <div className="shrink-0">
                    <label className="cursor-pointer bg-studio-card border border-studio-border hover:border-studio-gold text-studio-gold px-3 py-2 rounded flex items-center space-x-1.5 text-xs font-semibold">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Optimizing...' : 'Upload File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {previewImage && (
                  <div className="mt-3 flex items-center space-x-3 p-2 bg-studio-dark/60 rounded-lg border border-studio-border/40">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-studio-gold/40 bg-black/80 shrink-0 flex items-center justify-center p-2">
                      {imageError ? (
                        <div className="flex flex-col items-center justify-center text-center p-2 text-red-400 text-[10px]">
                          <AlertCircle className="w-5 h-5 mb-1 opacity-80" />
                          <span>Link error</span>
                        </div>
                      ) : (
                        <img
                          src={getFullImageUrl(previewImage)}
                          alt="Preview"
                          className="max-w-full max-h-full object-contain"
                          onError={() => setImageError(true)}
                        />
                      )}
                    </div>
                    <div className="text-[11px] text-studio-textMuted space-y-1 overflow-hidden">
                      <p className="font-semibold text-studio-gold flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{imageError ? 'Image Load Warning' : 'Motif Preview Active'}</span>
                      </p>
                      <p className="line-clamp-2 break-all text-[10px]">
                        {previewImage.startsWith('data:') ? '✓ High-Resolution Local Upload' : previewImage}
                      </p>
                      {imageError && (
                        <p className="text-red-400 text-[10px]">
                          Tip: Use 'Upload File' or ensure the URL points to a public image.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">Target Body Areas (comma separated)</label>
                <input
                  type="text"
                  placeholder="Forearm, Upper Arm, Chest, Back, Calf"
                  value={bodyAreas}
                  onChange={(e) => setBodyAreas(e.target.value)}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-studio-textMuted uppercase mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    value={estTimeHours}
                    onChange={(e) => setEstTimeHours(e.target.value)}
                    className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                  />
                </div>

                <div>
                  <label className="block font-bold text-studio-textMuted uppercase mb-1">Inquiry Mode</label>
                  <input
                    type="text"
                    value={estPriceRange}
                    onChange={(e) => setEstPriceRange(e.target.value)}
                    placeholder="WhatsApp Direct Contact (+91 78079 66080)"
                    className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze text-emerald-400 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">Description &amp; Symbolism</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Spiritual significance, meaning, recommended needle groupings..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  {submitting ? 'Saving...' : 'Save 3D Motif'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
