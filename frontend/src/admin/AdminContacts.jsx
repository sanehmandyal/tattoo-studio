import React, { useState, useEffect } from 'react';
import { contactAPI } from '../services/api';
import { MessageSquare, Mail, Phone, Clock, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const res = await contactAPI.getAll();
      if (res.success) setContacts(res.contacts);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await contactAPI.updateStatus(id, { status });
      toast.success(`Inquiry marked as ${status}`);
      loadContacts();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await contactAPI.delete(id);
      toast.success('Inquiry removed');
      loadContacts();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-studio-border/30 pb-4">
        <h1 className="font-condensed font-black text-3xl uppercase tracking-wider text-studio-textMain">
          Customer Inquiries &amp; Consultations
        </h1>
        <p className="text-xs text-studio-textMuted">
          Review general inquiries, consultation requests, and client messages from the contact form.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-studio-textMuted">Loading inquiries...</div>
      ) : contacts.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-xl border border-studio-border/40 text-studio-textMuted text-xs">
          No inquiries in queue.
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((c) => (
            <div
              key={c._id}
              className="glass-card p-5 rounded-xl border border-studio-border/50 shadow-xl space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-studio-border/30 pb-3 gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-studio-textMain">{c.name}</h3>
                    <span
                      className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        c.status === 'new'
                          ? 'bg-studio-glowCyan/10 text-studio-glowCyan border-studio-glowCyan/30'
                          : c.status === 'responded'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-studio-card text-studio-textMuted border-studio-border'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-studio-textMuted mt-0.5">
                    {c.email} {c.phone && `• ${c.phone}`}
                  </p>
                </div>

                <div className="text-[11px] text-studio-textMuted">
                  {new Date(c.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-studio-bronzeLight">
                  Subject: {c.subject}
                </span>
                <p className="text-xs text-studio-textMain/90 leading-relaxed bg-studio-secondary/40 p-3 rounded border border-studio-border/20">
                  {c.message}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 text-xs">
                {c.status === 'new' && (
                  <button
                    onClick={() => handleUpdateStatus(c._id, 'responded')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded transition-colors"
                  >
                    Mark as Responded
                  </button>
                )}
                <a
                  href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject)} - INK CARVERS Studio`}
                  className="bg-studio-bronze hover:bg-studio-bronzeLight text-studio-darker font-bold px-3 py-1.5 rounded transition-colors"
                >
                  Reply via Email
                </a>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="border border-red-500/30 text-red-400 hover:bg-red-500/10 p-1.5 rounded"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
