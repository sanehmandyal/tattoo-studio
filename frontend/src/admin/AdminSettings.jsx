import React, { useState, useEffect } from 'react';
import { settingsAPI } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { Save, Building, Phone, Mail, MapPin, Globe, Sparkles, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export const AdminSettings = () => {
  const { settings, refreshSettings, updateSettingsState } = useSettings();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [studioName, setStudioName] = useState('');
  const [tagline, setTagline] = useState('');
  const [heroHeadline, setHeroHeadline] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [monFriHours, setMonFriHours] = useState('');
  const [satHours, setSatHours] = useState('');
  const [sunHours, setSunHours] = useState('');
  const [googleMapsEmbedUrl, setGoogleMapsEmbedUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [mainStory, setMainStory] = useState('');
  const [mission, setMission] = useState('');

  useEffect(() => {
    if (settings) {
      setStudioName(settings.studioName || 'LAND OF GOD TATTOO STUDIO');
      setTagline(settings.tagline || 'Sacred Devbhoomi Inking & Fine Precision Artistry');
      setHeroHeadline(settings.heroHeadline || 'SACRED DEVBHOOMI INK. MASTER CRAFTSMANSHIP.');
      setHeroSubtitle(settings.heroSubtitle || 'Where ancient sacred symbols, hyper-realism, and lifelong precision meet divine devotion in Una, Himachal Pradesh.');
      setPhone(settings.phone || '+91 78079 66080');
      setWhatsapp(settings.whatsapp || settings.socialLinks?.whatsapp || '+917807966080');
      setEmail(settings.email || 'admin@landofgodtattoos.com');
      setStreet(settings.address?.street || 'Friends Colony');
      setCity(settings.address?.city || 'Una');
      setState(settings.address?.state || 'Himachal Pradesh');
      setZip(settings.address?.zip || '174303');
      setMonFriHours(settings.businessHours?.mon_fri || '10:00 AM – 8:30 PM');
      setSatHours(settings.businessHours?.saturday || '10:00 AM – 9:00 PM');
      setSunHours(settings.businessHours?.sunday || '11:00 AM – 7:00 PM');
      setGoogleMapsEmbedUrl(settings.googleMapsEmbedUrl || '');
      setInstagramUrl(settings.socialLinks?.instagram || 'https://instagram.com/landofgodtattoo');
      setFacebookUrl(settings.socialLinks?.facebook || 'https://facebook.com/landofgodtattoostudio');
      setMainStory(settings.aboutContent?.mainStory || '');
      setMission(settings.aboutContent?.mission || '');
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        studioName,
        tagline,
        heroHeadline,
        heroSubtitle,
        phone,
        whatsapp,
        email,
        address: { street, city, state, zip, country: 'India' },
        businessHours: {
          mon_fri: monFriHours,
          saturday: satHours,
          sunday: sunHours,
        },
        googleMapsEmbedUrl,
        socialLinks: { 
          instagram: instagramUrl,
          facebook: facebookUrl,
          whatsapp: whatsapp 
        },
        aboutContent: { 
          mainStory,
          mission 
        },
      };

      const res = await settingsAPI.update(payload);
      if (res.success) {
        updateSettingsState(payload);
        await refreshSettings();
        toast.success('Studio & website settings saved! Public site updated immediately.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-studio-border/30 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-condensed font-black text-3xl uppercase tracking-wider text-studio-textMain">
            Studio Brand &amp; Website Settings
          </h1>
          <p className="text-xs text-studio-textMuted">
            Manage your studio identity, contact numbers, address in Friends Colony, Una, and hero headers.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="bg-studio-bronze hover:bg-studio-bronzeLight text-studio-darker font-condensed font-bold px-5 py-2.5 text-xs uppercase tracking-wider rounded shadow-bronze flex items-center space-x-2 shrink-0 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-left text-xs">
        {/* Brand & Hero Identity */}
        <div className="glass-panel p-6 rounded-xl border border-studio-border/50 shadow-xl space-y-4">
          <h2 className="font-condensed font-bold text-lg text-studio-textMain uppercase border-b border-studio-border/30 pb-2 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-studio-bronzeLight" />
            <span>Studio Identity &amp; Hero Headline</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-studio-textMuted uppercase mb-1">Studio Brand Name</label>
              <input
                type="text"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-studio-textMuted uppercase mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-studio-textMuted uppercase mb-1">Hero Main Headline</label>
            <input
              type="text"
              value={heroHeadline}
              onChange={(e) => setHeroHeadline(e.target.value)}
              className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze font-bold text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-studio-textMuted uppercase mb-1">Hero Subtitle</label>
            <textarea
              rows="2"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
            />
          </div>
        </div>

        {/* Contact & WhatsApp */}
        <div className="glass-panel p-6 rounded-xl border border-studio-border/50 shadow-xl space-y-4">
          <h2 className="font-condensed font-bold text-lg text-studio-textMain uppercase border-b border-studio-border/30 pb-2 flex items-center space-x-2">
            <Phone className="w-4 h-4 text-studio-bronzeLight" />
            <span>Direct Studio Contact Desk</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-studio-textMuted uppercase mb-1">Telephone / Calling</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 78079 66080"
                className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-studio-textMuted uppercase mb-1">WhatsApp Direct Number</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+91 78079 66080"
                className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze font-bold text-emerald-400"
              />
            </div>

            <div>
              <label className="block font-bold text-studio-textMuted uppercase mb-1">Studio Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
              />
            </div>
          </div>
        </div>

        {/* Studio Location in Una */}
        <div className="glass-panel p-6 rounded-xl border border-studio-border/50 shadow-xl space-y-4">
          <h2 className="font-condensed font-bold text-lg text-studio-textMain uppercase border-b border-studio-border/30 pb-2 flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-studio-bronzeLight" />
            <span>Studio Address &amp; Location (Una, HP)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-studio-textMuted uppercase mb-1">Street / Landmark</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Friends Colony"
                className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
              />
            </div>

            <div>
              <label className="block font-bold text-studio-textMuted uppercase mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Una"
                className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
              />
            </div>

            <div>
              <label className="block font-bold text-studio-textMuted uppercase mb-1">State &amp; PIN</label>
              <input
                type="text"
                value={`${state} ${zip}`}
                onChange={(e) => {
                  setState('Himachal Pradesh');
                  setZip('174303');
                }}
                placeholder="Himachal Pradesh 174303"
                className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-studio-textMuted uppercase mb-1">Google Maps Embed URL</label>
            <input
              type="text"
              value={googleMapsEmbedUrl}
              onChange={(e) => setGoogleMapsEmbedUrl(e.target.value)}
              className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
            />
          </div>
        </div>

        {/* Operating Hours */}
        <div className="glass-panel p-6 rounded-xl border border-studio-border/50 shadow-xl space-y-4">
          <h2 className="font-condensed font-bold text-lg text-studio-textMain uppercase border-b border-studio-border/30 pb-2 flex items-center space-x-2">
            <Building className="w-4 h-4 text-studio-bronzeLight" />
            <span>Operating Timings</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-studio-textMuted uppercase mb-1">Mon – Fri</label>
              <input
                type="text"
                value={monFriHours}
                onChange={(e) => setMonFriHours(e.target.value)}
                className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
              />
            </div>
            <div>
              <label className="block font-bold text-studio-textMuted uppercase mb-1">Saturday</label>
              <input
                type="text"
                value={satHours}
                onChange={(e) => setSatHours(e.target.value)}
                className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
              />
            </div>
            <div>
              <label className="block font-bold text-studio-textMuted uppercase mb-1">Sunday</label>
              <input
                type="text"
                value={sunHours}
                onChange={(e) => setSunHours(e.target.value)}
                className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="glass-panel p-6 rounded-xl border border-studio-border/50 shadow-xl space-y-4">
          <h2 className="font-condensed font-bold text-lg text-studio-textMain uppercase border-b border-studio-border/30 pb-2 flex items-center space-x-2">
            <Globe className="w-4 h-4 text-studio-bronzeLight" />
            <span>Social &amp; Web Links</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-studio-textMuted uppercase mb-1">Instagram Profile</label>
              <input
                type="text"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
              />
            </div>
            <div>
              <label className="block font-bold text-studio-textMuted uppercase mb-1">Facebook Page</label>
              <input
                type="text"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
              />
            </div>
          </div>
        </div>

        {/* About Editorial */}
        <div className="glass-panel p-6 rounded-xl border border-studio-border/50 shadow-xl space-y-4">
          <h2 className="font-condensed font-bold text-lg text-studio-textMain uppercase border-b border-studio-border/30 pb-2 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-studio-bronzeLight" />
            <span>About Us &amp; Studio Heritage Narrative</span>
          </h2>

          <div>
            <label className="block font-bold text-studio-textMuted uppercase mb-1">Main Studio Story</label>
            <textarea
              rows="3"
              value={mainStory}
              onChange={(e) => setMainStory(e.target.value)}
              className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
            />
          </div>

          <div>
            <label className="block font-bold text-studio-textMuted uppercase mb-1">Studio Mission &amp; Sterile Standard</label>
            <textarea
              rows="2"
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-studio-bronze hover:bg-studio-bronzeLight text-studio-darker font-condensed font-bold px-8 py-3 text-xs uppercase tracking-wider rounded shadow-bronze flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating Website...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
