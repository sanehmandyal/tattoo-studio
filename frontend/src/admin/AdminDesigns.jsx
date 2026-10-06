import React, { useState, useEffect } from 'react';
import { designsAPI } from '../services/api';
import { Plus, Edit, Trash2, Sparkles, Upload, Star, Check, Layers, AlertCircle, Eye, Sliders } from 'lucide-react';
import { toast } from 'sonner';
import { cleanImageUrl, compressImageFile, getFullImageUrl } from '../utils/imageHelper';

const AVAILABLE_BODY_AREAS = [
  'Forearm',
  'Upper Arm',
  'Shoulder',
  'Chest',
  'Back',
  'Spine',
  'Neck',
  'Wrist',
  'Thigh',
  'Calf',
  'Ankle',
  'Ribs',
  'Hand',
  'Collarbone',
];

const AVAILABLE_STYLES = [
  'Geometric',
  'Sacred Devbhoomi',
  'Minimalist',
  'Fine Line',
  'Blackwork',
  'Traditional',
  'Neo-Traditional',
  'Mandala',
  'Realism',
  'Script',
  'Japanese',
  'Watercolor',
];

export const AdminDesigns = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDesign, setEditingDesign] = useState(null);
  const [selectedBodyFilter, setSelectedBodyFilter] = useState('All');

  // Form State
  const [name, setName] = useState('');
  const [style, setStyle] = useState('Geometric');
  const [selectedAreas, setSelectedAreas] = useState(['Forearm']);
  const [customAreaInput, setCustomAreaInput] = useState('');
  const [description, setDescription] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [estTimeHours, setEstTimeHours] = useState(3);
  const [estPriceRange, setEstPriceRange] = useState('Direct Inquiry (WhatsApp)');
  const [isDefaultReference, setIsDefaultReference] = useState(false);
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

  const toggleAreaSelection = (area) => {
    if (selectedAreas.includes(area)) {
      setSelectedAreas(selectedAreas.filter((a) => a !== area));
    } else {
      setSelectedAreas([...selectedAreas, area]);
    }
  };

  const handleAddCustomArea = () => {
    if (!customAreaInput.trim()) return;
    const trimmed = customAreaInput.trim();
    if (!selectedAreas.includes(trimmed)) {
      setSelectedAreas([...selectedAreas, trimmed]);
    }
    setCustomAreaInput('');
  };

  const openCreateModal = () => {
    setEditingDesign(null);
    setName('');
    setStyle('Geometric');
    setSelectedAreas(selectedBodyFilter !== 'All' ? [selectedBodyFilter] : ['Forearm', 'Upper Arm']);
    setCustomAreaInput('');
    setDescription('');
    setPreviewImage('https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=500&q=80');
    setDifficulty('Intermediate');
    setEstTimeHours(3);
    setEstPriceRange('Direct Inquiry (WhatsApp)');
    setIsDefaultReference(false);
    setImageError(false);
    setModalOpen(true);
  };

  const openEditModal = (design) => {
    setEditingDesign(design);
    setName(design.name);
    setStyle(design.style || 'Geometric');
    setSelectedAreas(design.bodyAreas && design.bodyAreas.length > 0 ? design.bodyAreas : ['Forearm']);
    setCustomAreaInput('');
    setDescription(design.description || '');
    setPreviewImage(design.previewImage || '');
    setDifficulty(design.difficulty || 'Intermediate');
    setEstTimeHours(design.estTimeHours || 3);
    setEstPriceRange(design.estPriceRange || 'Direct Inquiry (WhatsApp)');
    setIsDefaultReference(Boolean(design.isDefaultReference));
    setImageError(false);
    setModalOpen(true);
  };

  const handleQuickToggleDefault = async (design) => {
    const newState = !design.isDefaultReference;
    try {
      await designsAPI.update(design._id, {
        ...design,
        isDefaultReference: newState,
      });
      toast.success(
        newState
          ? `🌟 "${design.name}" is now the PRIMARY REFERENCE for ${(design.bodyAreas || []).join(', ')}!`
          : `Removed default reference priority for "${design.name}"`
      );
      loadDesigns();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update reference status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !previewImage || !description) {
      toast.error('Please fill name, image and description');
      return;
    }
    if (selectedAreas.length === 0) {
      toast.error('Please select at least one target body part');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        style,
        bodyAreas: selectedAreas,
        description,
        previewImage,
        transparentOverlay: previewImage,
        difficulty,
        estTimeHours: Number(estTimeHours),
        estPriceRange,
        isDefaultReference: Boolean(isDefaultReference),
        isReferenceTattoo: true,
      };

      if (editingDesign) {
        await designsAPI.update(editingDesign._id, payload);
        toast.success(`3D Design "${name}" updated successfully!`);
      } else {
        await designsAPI.create(payload);
        toast.success(`Reference tattoo "${name}" assigned to ${selectedAreas.join(', ')}!`);
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

  const filteredDesigns = designs.filter((d) => {
    if (selectedBodyFilter === 'All') return true;
    return (d.bodyAreas || []).some(
      (area) => area.toLowerCase() === selectedBodyFilter.toLowerCase()
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-studio-border/30 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-studio-gold text-lg">🔱</span>
            <h1 className="font-condensed font-black text-2xl sm:text-3xl uppercase tracking-wider text-studio-textMain">
              Body Part Reference Tattoos &amp; 3D Placement
            </h1>
          </div>
          <p className="text-xs text-studio-textMuted mt-1">
            Configure which reference tattoo automatically appears when a client touches or selects a specific body part on the 3D model.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-studio-bronze hover:bg-studio-bronzeLight text-white font-condensed font-bold px-4 py-2.5 text-xs uppercase tracking-wider rounded shadow-bronze flex items-center space-x-1.5 shrink-0 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reference Tattoo</span>
        </button>
      </div>

      {/* BODY PART FILTER MATRIX */}
      <div className="glass-panel p-3.5 rounded-xl border border-studio-border/50 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-studio-bronzeLight flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Filter By Body Part Reference:</span>
          </span>
          <span className="text-[11px] text-studio-textMuted">
            {filteredDesigns.length} of {designs.length} reference tattoos
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedBodyFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
              selectedBodyFilter === 'All'
                ? 'bg-studio-bronze text-white shadow-md'
                : 'bg-studio-secondary/80 text-studio-textMuted hover:text-white border border-studio-border/40'
            }`}
          >
            All Parts ({designs.length})
          </button>
          {AVAILABLE_BODY_AREAS.map((part) => {
            const count = designs.filter((d) =>
              (d.bodyAreas || []).some((a) => a.toLowerCase() === part.toLowerCase())
            ).length;
            const hasDefault = designs.some(
              (d) =>
                d.isDefaultReference &&
                (d.bodyAreas || []).some((a) => a.toLowerCase() === part.toLowerCase())
            );

            return (
              <button
                key={part}
                onClick={() => setSelectedBodyFilter(part)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 flex items-center space-x-1.5 transition-all ${
                  selectedBodyFilter === part
                    ? 'bg-sky-600 dark:bg-studio-glowCyan text-white dark:text-gray-950 shadow-md font-black'
                    : 'bg-studio-secondary/80 text-studio-textMuted hover:text-white border border-studio-border/40'
                }`}
              >
                <span>{part}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedBodyFilter === part
                      ? 'bg-black/20 text-current'
                      : 'bg-studio-card text-studio-textMuted'
                  }`}
                >
                  {count}
                </span>
                {hasDefault && (
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" title="Has primary reference assigned" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-studio-textMuted">Loading 3D reference catalog...</div>
      ) : filteredDesigns.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-xl border border-studio-border/40 text-studio-textMuted text-xs space-y-3">
          <p>No reference tattoo motifs assigned for "{selectedBodyFilter}".</p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center space-x-1 px-4 py-2 rounded bg-studio-bronze text-white text-xs font-bold uppercase"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Assign First Tattoo for {selectedBodyFilter}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDesigns.map((design) => {
            const isPrimary = Boolean(design.isDefaultReference);

            return (
              <div
                key={design._id}
                className={`glass-card rounded-xl overflow-hidden border transition-all duration-200 shadow-xl flex flex-col justify-between ${
                  isPrimary
                    ? 'border-amber-400/80 bg-amber-950/10 shadow-amber-950/30'
                    : 'border-studio-border/50 hover:border-studio-border'
                }`}
              >
                {/* Image Container */}
                <div className="relative h-56 bg-black/80 flex items-center justify-center p-4 group">
                  <img
                    src={getFullImageUrl(design.previewImage)}
                    alt={design.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
                  />

                  {/* Primary reference badge */}
                  {isPrimary && (
                    <span className="absolute top-2.5 left-2.5 bg-amber-500 text-gray-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-lg flex items-center space-x-1 border border-amber-300">
                      <Star className="w-3 h-3 fill-gray-950" />
                      <span>PRIMARY REFERENCE</span>
                    </span>
                  )}

                  {!isPrimary && (
                    <span className="absolute top-2.5 left-2.5 bg-studio-darker/90 text-[10px] font-bold text-studio-gold uppercase px-2 py-0.5 rounded border border-studio-gold/30">
                      {design.style}
                    </span>
                  )}

                  <span className="absolute top-2.5 right-2.5 bg-studio-card text-[10px] font-bold text-studio-textMain px-2 py-0.5 rounded border border-studio-border/40">
                    {design.difficulty}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="font-condensed font-bold text-base text-studio-textMain uppercase line-clamp-1">
                      {design.name}
                    </h3>

                    {/* Assigned Body Parts Badge Chips */}
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {(design.bodyAreas || ['Forearm']).map((area) => (
                        <span
                          key={area}
                          className="bg-studio-secondary text-studio-glowCyan border border-studio-glowCyan/30 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        >
                          📍 {area}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-studio-textMuted line-clamp-2 pt-1">
                      {design.description}
                    </p>
                  </div>

                  {/* Quick Actions */}
                  <div className="pt-3 border-t border-studio-border/30 space-y-2">
                    {/* Toggle Primary Reference Button */}
                    <button
                      type="button"
                      onClick={() => handleQuickToggleDefault(design)}
                      className={`w-full py-1.5 px-2.5 rounded text-[11px] font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all ${
                        isPrimary
                          ? 'bg-amber-400 text-gray-950 hover:bg-amber-300 shadow-md'
                          : 'bg-studio-secondary hover:bg-studio-card text-studio-textMuted hover:text-amber-300 border border-studio-border/50'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isPrimary ? 'fill-gray-950' : ''}`} />
                      <span>
                        {isPrimary ? '⭐ Primary Reference Active' : 'Set as Primary Reference'}
                      </span>
                    </button>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-emerald-400 font-bold">
                        💬 ~{design.estTimeHours || 3}h • WhatsApp
                      </span>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => openEditModal(design)}
                          className="p-1.5 rounded border border-studio-border hover:border-studio-bronze text-studio-bronzeLight hover:text-white"
                          title="Edit Details & Body Parts"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(design._id, design.name)}
                          className="p-1.5 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10"
                          title="Delete Motif"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-xl w-full bg-studio-card border border-studio-border rounded-xl p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between border-b border-studio-border/30 pb-3">
              <h3 className="font-condensed font-bold text-xl sm:text-2xl text-studio-textMain uppercase flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-studio-gold" />
                <span>{editingDesign ? 'Edit Reference Tattoo Motif' : 'Add Reference Tattoo Motif'}</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-studio-textMuted hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs">
              {/* Name */}
              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">
                  Motif Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahadev Trishul & Sacred Damru"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze font-bold text-sm"
                />
              </div>

              {/* Style & Complexity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-studio-textMuted uppercase mb-1">Style</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze font-semibold"
                  >
                    {AVAILABLE_STYLES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-studio-textMuted uppercase mb-1">Complexity</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze font-semibold"
                  >
                    <option value="Simple">Simple</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Complex">Complex</option>
                    <option value="Masterpiece">Masterpiece</option>
                  </select>
                </div>
              </div>

              {/* BODY PART TARGETING CHIPS */}
              <div className="p-3.5 bg-studio-secondary/60 rounded-xl border border-studio-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-studio-gold uppercase">
                    Target Body Part(s) <span className="text-red-400">*</span>
                  </label>
                  <span className="text-[10px] text-studio-textMuted">
                    Click body parts to assign this tattoo
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {AVAILABLE_BODY_AREAS.map((part) => {
                    const isSelected = selectedAreas.includes(part);
                    return (
                      <button
                        type="button"
                        key={part}
                        onClick={() => toggleAreaSelection(part)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                          isSelected
                            ? 'bg-sky-600 dark:bg-studio-glowCyan text-white dark:text-gray-950 shadow-md ring-2 ring-studio-glowCyan/50'
                            : 'bg-studio-card text-studio-textMuted hover:text-white border border-studio-border/50'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{part}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Body Part Input */}
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add custom body part (e.g. Ribs / Collarbone)..."
                    value={customAreaInput}
                    onChange={(e) => setCustomAreaInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomArea();
                      }
                    }}
                    className="flex-1 bg-studio-card border border-studio-border rounded px-3 py-1.5 text-xs text-studio-textMain focus:outline-none focus:border-studio-bronze"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomArea}
                    className="px-3 py-1.5 bg-studio-secondary hover:bg-studio-card border border-studio-border text-xs font-bold text-studio-bronzeLight rounded"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* PRIMARY REFERENCE TOGGLE CHECKBOX */}
              <div className="p-3 bg-amber-950/20 border border-amber-500/40 rounded-xl flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="isDefaultRefToggle"
                  checked={isDefaultReference}
                  onChange={(e) => setIsDefaultReference(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-amber-500 cursor-pointer rounded"
                />
                <label htmlFor="isDefaultRefToggle" className="cursor-pointer text-left">
                  <span className="font-bold text-amber-300 block text-xs">
                    🌟 Set as Primary Reference Tattoo for selected body part(s)
                  </span>
                  <span className="text-[11px] text-studio-textMuted block mt-0.5">
                    When enabled, touching any of the selected body parts on the 3D model will automatically select and project this tattoo!
                  </span>
                </label>
              </div>

              {/* Upload Motif Image */}
              <div className="space-y-2 border border-studio-border/50 bg-studio-secondary/60 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-studio-textMuted uppercase">
                    Motif Artwork / PNG <span className="text-red-400">*</span>
                  </label>
                  <span className="text-[10px] text-studio-textMuted">Transparent PNG or Tattoo Photo</span>
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

              {/* Hours & WhatsApp Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-studio-textMuted uppercase mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    value={estTimeHours}
                    onChange={(e) => setEstTimeHours(e.target.value)}
                    className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-studio-textMuted uppercase mb-1">Inquiry Mode</label>
                  <input
                    type="text"
                    value={estPriceRange}
                    onChange={(e) => setEstPriceRange(e.target.value)}
                    placeholder="Direct WhatsApp Inquiry"
                    className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze text-emerald-400 font-semibold"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">
                  Description &amp; Symbolism <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Spiritual significance, meaning, anatomical flow on the body..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze font-sans"
                />
              </div>

              {/* Form Footer */}
              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-studio-border/30">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-studio-textMuted hover:text-studio-textMain font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-studio-bronze hover:bg-studio-bronzeLight text-white font-bold px-6 py-2.5 uppercase tracking-wider rounded shadow-bronze flex items-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{submitting ? 'Saving Reference...' : 'Save Reference Tattoo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

