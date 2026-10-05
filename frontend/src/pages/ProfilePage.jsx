import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import { Calendar, Clock, User, Phone, Mail, Sparkles, AlertCircle, CheckCircle, XCircle, Camera, Edit3, Shield, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { cleanImageUrl, compressImageFile, getFullImageUrl } from '../utils/imageHelper';

export const ProfilePage = () => {
  const { user, logout, updateProfile, isAdmin } = useAuth();
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyBookings = async () => {
      try {
        const res = await bookingsAPI.getMyBookings();
        if (res.success) {
          setMyBookings(res.bookings || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, [user, navigate]);

  const openEditModal = () => {
    setEditName(user?.name || '');
    setEditPhone(user?.phone || '');
    setEditAvatar(user?.avatar || '');
    setEditPassword('');
    setAvatarError(false);
    setIsEditModalOpen(true);
  };

  const handleAvatarFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const compressedDataUrl = await compressImageFile(file, { maxWidth: 800, maxHeight: 800, quality: 0.85 });
      setEditAvatar(compressedDataUrl);
      setAvatarError(false);
      toast.success('Avatar image optimized and ready to save!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to process image file');
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const payload = {
        name: editName,
        phone: editPhone,
        avatar: editAvatar,
      };
      if (editPassword.trim()) {
        payload.password = editPassword.trim();
      }

      const res = await updateProfile(payload);
      if (res?.success) {
        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  if (!user) return null;

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'Master Sunil')}&background=181512&color=d4a359&size=256&bold=true`;
  const displayAvatar = user.avatar ? getFullImageUrl(user.avatar) : defaultAvatar;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-studio-bg">
      <Helmet>
        <title>{user.name}'s Studio Dashboard — LAND OF GOD TATTOO STUDIO</title>
      </Helmet>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* User Card Header */}
        <div className="glass-panel-dark p-6 sm:p-8 rounded-2xl border border-studio-border/60 mb-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
            <div className="relative group shrink-0">
              <img
                src={displayAvatar}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-studio-gold shadow-gold bg-studio-darker"
                onError={(e) => {
                  e.target.src = defaultAvatar;
                }}
              />
              <button
                onClick={openEditModal}
                title="Change Profile Picture"
                className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-studio-gold"
              >
                <Camera className="w-6 h-6 drop-shadow" />
              </button>
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                {isAdmin ? (
                  <span className="text-[10px] uppercase tracking-widest font-black text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/30 flex items-center space-x-1">
                    <Shield className="w-3 h-3 text-amber-400" />
                    <span>Master Admin &amp; Studio Director</span>
                  </span>
                ) : (
                  <span className="text-[10px] uppercase tracking-widest font-bold text-studio-bronzeLight bg-studio-card px-2.5 py-0.5 rounded border border-studio-border/30">
                    Studio Client
                  </span>
                )}
              </div>
              <h1 className="font-condensed font-black text-3xl sm:text-4xl text-studio-textMain uppercase mt-1">
                {user.name}
              </h1>
              <p className="text-xs text-studio-textMuted mt-0.5">
                {user.email} • {user.phone || 'No phone recorded'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="bg-studio-gold hover:bg-studio-goldLight text-studio-darker font-condensed font-bold px-4 py-2.5 text-xs uppercase tracking-wider rounded shadow-gold flex items-center space-x-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Control Center</span>
              </Link>
            )}

            <button
              onClick={openEditModal}
              className="bg-studio-card hover:bg-studio-secondary border border-studio-border hover:border-studio-gold text-studio-textMain px-4 py-2.5 text-xs font-semibold rounded flex items-center space-x-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-studio-gold" />
              <span>Edit Profile &amp; Picture</span>
            </button>

            <Link
              to="/booking"
              className="bg-studio-bronze hover:bg-studio-bronzeLight text-studio-darker font-condensed font-bold px-4 py-2.5 text-xs uppercase tracking-wider rounded shadow-bronze"
            >
              Book New Tattoo
            </Link>

            <button
              onClick={logout}
              className="border border-studio-border hover:border-red-400 text-studio-textMuted hover:text-red-400 px-4 py-2.5 text-xs font-semibold rounded transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* My Appointments List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-studio-border/30 pb-3">
            <h2 className="font-condensed font-black text-2xl uppercase tracking-wider text-studio-textMain">
              My Tattoo Appointments ({myBookings.length})
            </h2>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-studio-textMuted">
              Loading appointments...
            </div>
          ) : myBookings.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-xl border border-studio-border/40 space-y-4">
              <Calendar className="w-12 h-12 text-studio-bronze/40 mx-auto" />
              <h3 className="text-lg font-bold text-studio-textMain">No appointments booked yet</h3>
              <p className="text-xs text-studio-textMuted max-w-sm mx-auto">
                Ready to transform your canvas? Explore our 3D placement lab or book directly with a master artist.
              </p>
              <Link
                to="/booking"
                className="inline-block bg-studio-bronze hover:bg-studio-bronzeLight text-studio-darker font-bold px-6 py-2.5 text-xs uppercase tracking-widest rounded shadow-bronze"
              >
                Schedule First Appointment
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myBookings.map((b) => {
                const isConfirmed = b.status === 'confirmed';
                const isPending = b.status === 'pending';
                const isCompleted = b.status === 'completed';

                return (
                  <div
                    key={b._id}
                    className="glass-card p-6 rounded-xl border border-studio-border/50 shadow-xl space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-studio-border/30 pb-3 mb-3">
                        <span className="font-mono text-xs font-bold text-studio-bronzeLight">
                          Ref: {b.bookingRef}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                            isConfirmed
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : isPending
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              : isCompleted
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              : 'bg-red-500/10 text-red-400 border-red-500/30'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      <h3 className="font-condensed font-black text-xl text-studio-textMain uppercase">
                        {b.tattooStyle} Tattoo — {b.bodyPlacement}
                      </h3>
                      <p className="text-xs text-studio-bronzeLight mt-0.5">
                        Concept: {b.selectedDesign || 'Custom Piece'}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-studio-textMuted bg-studio-secondary/60 p-3 rounded border border-studio-border/20">
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-studio-textMuted/70">Date:</span>
                          <span className="font-semibold text-studio-textMain">{b.preferredDate}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-studio-textMuted/70">Time:</span>
                          <span className="font-semibold text-studio-textMain">{b.preferredTimeSlot}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-studio-textMuted/70">Artist:</span>
                          <span className="font-semibold text-studio-textMain">{b.artist?.name || 'Resident'}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-studio-textMuted/70">Size:</span>
                          <span className="font-semibold text-studio-textMain">{b.approximateSize}</span>
                        </div>
                      </div>

                      {b.additionalNotes && (
                        <p className="text-xs text-studio-textMuted/80 italic mt-3">
                          "{b.additionalNotes}"
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-studio-border/30 text-xs text-studio-textMuted flex items-center justify-between">
                      <span>Submitted: {new Date(b.createdAt).toLocaleDateString()}</span>
                      <Link to="/contact" className="text-studio-bronzeLight hover:underline font-semibold">
                        Need Changes? Contact Studio
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Edit Profile & Avatar Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-md w-full bg-studio-card border border-studio-border rounded-xl p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-studio-border/30 pb-3">
              <h3 className="font-condensed font-bold text-2xl text-studio-textMain uppercase flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-studio-gold" />
                <span>Edit Profile &amp; Picture</span>
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-studio-textMuted hover:text-studio-textMain p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-left text-xs">
              
              {/* Avatar Section */}
              <div className="space-y-2 bg-studio-secondary/60 p-3 rounded-lg border border-studio-border/40">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-studio-textMuted uppercase">Profile Avatar</label>
                  <span className="text-[10px] text-studio-textMuted">Upload Photo or Paste Link</span>
                </div>

                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Paste Image URL (Unsplash, Drive, etc.)"
                      value={editAvatar}
                      onChange={(e) => {
                        const cleaned = cleanImageUrl(e.target.value);
                        setEditAvatar(cleaned);
                        setAvatarError(false);
                      }}
                      className="w-full bg-studio-card border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze text-xs"
                    />
                  </div>
                  <label className="cursor-pointer bg-studio-card border border-studio-border hover:border-studio-gold text-studio-gold px-3 py-2 rounded flex items-center space-x-1 text-xs font-semibold shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingAvatar ? 'Loading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Avatar Preview */}
                <div className="mt-2 flex items-center space-x-3 p-2 bg-studio-dark/70 rounded-lg border border-studio-border/40">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-studio-gold bg-black shrink-0 flex items-center justify-center">
                    {avatarError ? (
                      <span className="text-red-400 text-[9px] font-bold">Error</span>
                    ) : (
                      <img
                        src={editAvatar ? getFullImageUrl(editAvatar) : defaultAvatar}
                        alt="Avatar Preview"
                        className="w-full h-full object-cover"
                        onError={() => setAvatarError(true)}
                      />
                    )}
                  </div>
                  <div className="text-[11px] text-studio-textMuted space-y-0.5 overflow-hidden">
                    <p className="font-semibold text-studio-gold">
                      {editAvatar ? (editAvatar.startsWith('data:') ? 'Custom Uploaded Photo' : 'Image Link Attached') : 'Default Monogram Emblem'}
                    </p>
                    {editAvatar && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditAvatar('');
                          setAvatarError(false);
                        }}
                        className="text-[10px] text-red-400 hover:underline"
                      >
                        Reset to default monogram
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                />
              </div>

              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 78079 66080"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                />
              </div>

              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">New Password (leave blank to keep current)</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-studio-border/30">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-studio-textMuted hover:text-studio-textMain"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="bg-studio-bronze hover:bg-studio-bronzeLight text-studio-darker font-bold px-5 py-2 uppercase tracking-wider rounded shadow-bronze"
                >
                  {savingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
