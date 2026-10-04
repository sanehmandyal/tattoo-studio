import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { settingsAPI } from '../services/api';

const defaultSettings = {
  studioName: 'LAND OF GOD TATTOO STUDIO',
  tagline: 'Sacred Devbhoomi Inking & Fine Precision Artistry',
  heroHeadline: 'SACRED DEVBHOOMI INK. MASTER CRAFTSMANSHIP.',
  heroSubtitle: 'Where ancient sacred symbols, hyper-realism, and lifelong precision meet divine devotion in Una, Himachal Pradesh. Powered by our real-time 3D Anatomy Placement Studio.',
  phone: '+91 78079 66080',
  whatsapp: '+917807966080',
  email: 'admin@landofgodtattoos.com',
  address: {
    street: 'Friends Colony',
    city: 'Una',
    state: 'Himachal Pradesh',
    zip: '174303',
    country: 'India',
  },
  businessHours: {
    mon_fri: '10:00 AM – 8:30 PM',
    saturday: '10:00 AM – 9:00 PM',
    sunday: '11:00 AM – 7:00 PM',
  },
  googleMapsEmbedUrl: 'https://maps.google.com/maps?q=Friends+Colony+Una+Himachal+Pradesh+174303&t=&z=15&ie=UTF8&iwloc=&output=embed',
  socialLinks: {
    instagram: 'https://instagram.com/landofgodtattoo',
    facebook: 'https://facebook.com/landofgodtattoostudio',
    whatsapp: '+917807966080',
  },
  aboutContent: {
    mainStory: 'LAND OF GOD TATTOO STUDIO was founded in the divine spiritual heartlands of Devbhoomi Una, Himachal Pradesh. We elevate custom sacred iconography, Mahadev Trishul geometry, micro-realism portraits, and bold neo-traditional masterpieces onto the living canvas with medical-grade European sterilization and German precision machines.',
    mission: 'Our sacred mission is to turn spiritual devotion, personal narratives, and visionary artistry into eternal emblems with lifelong pigment vibrancy and absolute sterile safety.',
  }
};

const SettingsContext = createContext({
  settings: defaultSettings,
  loading: false,
  refreshSettings: async () => {},
  updateSettingsState: () => {},
});

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await settingsAPI.getPublic();
      if (res.success && res.settings) {
        setSettings((prev) => ({
          ...prev,
          ...res.settings,
          address: {
            ...prev.address,
            ...(res.settings.address || {}),
          },
          businessHours: {
            ...prev.businessHours,
            ...(res.settings.businessHours || {}),
          },
          socialLinks: {
            ...prev.socialLinks,
            ...(res.settings.socialLinks || {}),
          },
          aboutContent: {
            ...prev.aboutContent,
            ...(res.settings.aboutContent || {}),
          }
        }));
      }
    } catch (err) {
      console.warn('Using default studio settings:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettingsState = (newSettings) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings: fetchSettings,
        updateSettingsState,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    return {
      settings: defaultSettings,
      loading: false,
      refreshSettings: async () => {},
      updateSettingsState: () => {},
    };
  }
  return context;
};
