import React, { useState, useEffect } from 'react';
import { aftercareAPI } from '../services/api';
import { Plus, Trash2, Edit, ShieldCheck, HeartPulse, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const AdminAftercare = () => {
  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [phase, setPhase] = useState('Days 1-3');
  const [instructionsText, setInstructionsText] = useState('');
  const [dosText, setDosText] = useState('');
  const [dontsText, setDontsText] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState('');

  const loadAftercare = async () => {
    setLoading(true);
    try {
      const res = await aftercareAPI.getAll();
      if (res.success) {
        setInstructions(res.aftercare || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load aftercare instructions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAftercare();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setPhase('Days 1-3');
    setInstructionsText('');
    setDosText('Wash gently with antibacterial soap\nPat dry with clean paper towel\nApply thin layer of aftercare balm');
    setDontsText('Do not scratch or peel\nAvoid direct sunlight\nNo swimming or soaking in water');
    setRecommendedProducts('Hustle Butter Deluxe, Dial Gold Soap');
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setTitle(item.title || '');
    setPhase(item.phase || 'Days 1-3');
    setInstructionsText(item.instructions || '');
    setDosText(Array.isArray(item.dos) ? item.dos.join('\n') : (item.dos || ''));
    setDontsText(Array.isArray(item.donts) ? item.donts.join('\n') : (item.donts || ''));
    setRecommendedProducts(Array.isArray(item.recommendedProducts) ? item.recommendedProducts.join(', ') : (item.recommendedProducts || ''));
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !instructionsText) {
      toast.error('Please enter phase title and instructions');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title,
        phase,
        instructions: instructionsText,
        dos: dosText.split('\n').map(s => s.trim()).filter(Boolean),
        donts: dontsText.split('\n').map(s => s.trim()).filter(Boolean),
        recommendedProducts: recommendedProducts.split(',').map(s => s.trim()).filter(Boolean),
      };

      if (editingItem) {
        await aftercareAPI.update(editingItem._id, payload);
        toast.success(`Aftercare phase "${title}" updated!`);
      } else {
        await aftercareAPI.create(payload);
        toast.success(`New aftercare phase "${title}" published!`);
      }
      setModalOpen(false);
      loadAftercare();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, phaseTitle) => {
    if (!window.confirm(`Delete "${phaseTitle}"?`)) return;
    try {
      await aftercareAPI.delete(id);
      toast.success('Phase deleted');
      loadAftercare();
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
            Sacred Healing &amp; Aftercare Guide
          </h1>
          <p className="text-xs text-studio-textMuted">
            Manage healing timeline steps, dos &amp; don'ts, antiseptic protocols, and recommended ointments shown to clients.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-studio-bronze hover:bg-studio-bronzeLight text-studio-darker font-condensed font-bold px-4 py-2 text-xs uppercase tracking-wider rounded shadow-bronze flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Aftercare Phase</span>
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-studio-textMuted">Loading aftercare guidelines...</div>
      ) : instructions.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-xl border border-studio-border/40 text-studio-textMuted text-xs">
          No aftercare guidelines configured yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructions.map((item) => (
            <div
              key={item._id}
              className="glass-card rounded-xl p-5 border border-studio-border/50 shadow-xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-studio-bronze/20 text-studio-bronzeLight border border-studio-bronze/40 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {item.phase || 'Healing Phase'}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1 rounded border border-studio-border text-studio-textMuted hover:text-studio-textMain"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, item.title)}
                      className="p-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-condensed font-bold text-lg text-studio-textMain uppercase">
                  {item.title}
                </h3>

                <p className="text-xs text-studio-textMuted leading-relaxed">
                  {item.instructions}
                </p>

                {/* Dos */}
                {item.dos && item.dos.length > 0 && (
                  <div className="space-y-1 pt-2">
                    <h5 className="text-[10px] font-bold uppercase text-emerald-400">Strictly Do:</h5>
                    <ul className="text-[11px] text-studio-textMuted space-y-0.5 list-disc pl-4">
                      {item.dos.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Don'ts */}
                {item.donts && item.donts.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <h5 className="text-[10px] font-bold uppercase text-red-400">Never Do:</h5>
                    <ul className="text-[11px] text-studio-textMuted space-y-0.5 list-disc pl-4">
                      {item.donts.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}
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
              {editingItem ? 'Edit Aftercare Guideline' : 'Create Aftercare Guideline'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-studio-textMuted uppercase mb-1">Phase Tag</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Days 1-3, Days 4-14, Long Term"
                    value={phase}
                    onChange={(e) => setPhase(e.target.value)}
                    className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                  />
                </div>
                <div>
                  <label className="block font-bold text-studio-textMuted uppercase mb-1">Phase Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. First 72 Hours: Initial Barrier & Cleansing"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">Detailed Instructions</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Explain step-by-step how to clean and care for fresh pigment..."
                  value={instructionsText}
                  onChange={(e) => setInstructionsText(e.target.value)}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-studio-textMuted uppercase mb-1">Do's (One per line)</label>
                  <textarea
                    rows="3"
                    value={dosText}
                    onChange={(e) => setDosText(e.target.value)}
                    className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                  />
                </div>

                <div>
                  <label className="block font-bold text-studio-textMuted uppercase mb-1">Don'ts (One per line)</label>
                  <textarea
                    rows="3"
                    value={dontsText}
                    onChange={(e) => setDontsText(e.target.value)}
                    className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">Recommended Products (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Hustle Butter, Dial Antibacterial Soap, Aquaphor"
                  value={recommendedProducts}
                  onChange={(e) => setRecommendedProducts(e.target.value)}
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
                  {submitting ? 'Saving...' : 'Save Guideline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
