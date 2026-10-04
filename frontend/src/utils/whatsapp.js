/**
 * WhatsApp Direct Communication Helper for LAND OF GOD TATTOO STUDIO (Una, Himachal Pradesh)
 * Studio Phone: +91 78079 66080
 */

export const STUDIO_WHATSAPP_NUMBER = '917807966080';

export const getStudioWhatsAppUrl = (customText = '') => {
  const base = `https://wa.me/${STUDIO_WHATSAPP_NUMBER}`;
  if (!customText) {
    const defaultMsg = encodeURIComponent(
      `🔱 *LAND OF GOD TATTOO STUDIO (UNA)*\n\nHello Master Sunil! I would like to consult about getting a custom tattoo at your Friends Colony studio.`
    );
    return `${base}?text=${defaultMsg}`;
  }
  return `${base}?text=${encodeURIComponent(customText)}`;
};

export const createBookingWhatsAppUrl = ({
  name = '',
  phone = '',
  artist = 'Master Sunil',
  style = 'Custom',
  design = 'Custom Concept',
  placement = 'Forearm',
  size = 'Medium (3-5 inches)',
  date = '',
  time = '',
  notes = '',
}) => {
  const message = `🔱 *LAND OF GOD TATTOO STUDIO — BOOKING INQUIRY*
━━━━━━━━━━━━━━━━━━━━
📍 *Studio:* Friends Colony, Una, HP (174303)
👤 *Client Name:* ${name || 'Prospective Client'}
📞 *Phone:* ${phone || 'N/A'}
🎨 *Style:* ${style}
🔱 *Design Motif:* ${design}
📍 *Body Placement:* ${placement}
📏 *Estimated Size:* ${size}
📅 *Preferred Date:* ${date || 'Earliest available'}
⏰ *Preferred Time:* ${time || 'Afternoon session'}
${notes ? `📝 *Notes:* ${notes}\n` : ''}━━━━━━━━━━━━━━━━━━━━
Please let me know consultation details and availability. Thank you!`;

  return `https://wa.me/${STUDIO_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const createArtworkInquiryUrl = (artworkName, artistName = 'Land of God Studio', placement = '') => {
  const message = `🔱 *LAND OF GOD TATTOO STUDIO (UNA) — ARTWORK INQUIRY*
━━━━━━━━━━━━━━━━━━━━
Hello Master Sunil! I am interested in knowing details and getting the "${artworkName}" tattoo${placement ? ` placed on the ${placement}` : ''}.

Please share session time, details, and booking slot availability at your Friends Colony, Una atelier. Thank you!`;

  return `https://wa.me/${STUDIO_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const createPortfolioInquiryUrl = (title, style = 'Custom', placement = 'General') => {
  const message = `🔱 *LAND OF GOD TATTOO STUDIO (UNA) — PORTFOLIO PIECE INQUIRY*
━━━━━━━━━━━━━━━━━━━━
Hello Master Sunil! I loved this masterpiece from your gallery:
🎨 *Tattoo Title:* ${title}
🔱 *Style:* ${style}
📍 *Placement:* ${placement}

Could you please share details, session time, and how to schedule this tattoo at your Friends Colony studio in Una? Thank you!`;

  return `https://wa.me/${STUDIO_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const createBookingInquiryUrl = (style = 'Custom', design = 'Custom Concept', date = '', time = '') => {
  return createBookingWhatsAppUrl({
    style,
    design,
    date,
    time,
  });
};

export const createAftercareHelplineUrl = () => {
  const message = `🔱 *LAND OF GOD TATTOO STUDIO — AFTERCARE HELPLINE*
━━━━━━━━━━━━━━━━━━━━
Hello! I have a question about my healing tattoo and aftercare instructions. Could you please advise me?`;

  return `https://wa.me/${STUDIO_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
