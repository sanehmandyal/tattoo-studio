import nodemailer from 'nodemailer';

// Configure transporter
const getTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null; // Fallback to simulated console logging
};

export const sendBookingNotification = async (booking, artistName = 'Resident Artist') => {
  const subject = `Appointment Request Received — ${booking.bookingRef} | INK CARVERS`;
  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #101415; color: #F5F2ED; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #1B2022; border: 1px solid rgba(193,162,123,0.3); border-radius: 8px; padding: 30px;">
        <h1 style="color: #C1A27B; text-align: center; letter-spacing: 2px; margin-bottom: 20px;">INK CARVERS</h1>
        <h2 style="color: #F5F2ED; font-size: 20px; border-bottom: 1px solid rgba(193,162,123,0.2); padding-bottom: 10px;">Booking Request Received</h2>
        <p>Dear <strong>${booking.customerName}</strong>,</p>
        <p>Thank you for submitting your custom tattoo appointment request. Our studio team and artist are reviewing your session requirements.</p>
        
        <div style="background-color: #252A2B; border-left: 3px solid #A7835D; padding: 15px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Reference ID:</strong> <span style="color: #C1A27B;">${booking.bookingRef}</span></p>
          <p style="margin: 5px 0;"><strong>Artist:</strong> ${artistName}</p>
          <p style="margin: 5px 0;"><strong>Style:</strong> ${booking.tattooStyle}</p>
          <p style="margin: 5px 0;"><strong>Placement:</strong> ${booking.bodyPlacement}</p>
          <p style="margin: 5px 0;"><strong>Requested Date:</strong> ${booking.preferredDate}</p>
          <p style="margin: 5px 0;"><strong>Time Slot:</strong> ${booking.preferredTimeSlot}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> <span style="text-transform: uppercase; color: #E5C07B;">${booking.status}</span></p>
        </div>
        
        <p style="color: #B9B5AF; font-size: 14px;">We will confirm your appointment within 24 hours. If you have any questions, feel free to reply directly to this email or call our studio.</p>
        <p style="color: #A7835D; margin-top: 30px; font-weight: bold;">INK CARVERS Tattoo Studio</p>
      </div>
    </div>
  `;

  console.log(`[Email Service] Notification sent for booking: ${booking.bookingRef} to: ${booking.customerEmail}`);
  
  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"INK CARVERS Studio" <${process.env.SMTP_FROM || 'noreply@inkcarvers.com'}>`,
        to: booking.customerEmail,
        subject,
        html,
      });
    } catch (err) {
      console.warn('[Email Service] SMTP dispatch warning:', err.message);
    }
  }
};

export const sendStatusUpdateNotification = async (booking, note = '') => {
  const subject = `Booking Update: ${booking.bookingRef} is now ${booking.status.toUpperCase()} | INK CARVERS`;
  console.log(`[Email Service] Status update sent for ${booking.bookingRef} -> Status: ${booking.status} (Email: ${booking.customerEmail})`);
  
  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"INK CARVERS Studio" <${process.env.SMTP_FROM || 'noreply@inkcarvers.com'}>`,
        to: booking.customerEmail,
        subject,
        html: `<p>Your booking <strong>${booking.bookingRef}</strong> status changed to: <strong>${booking.status}</strong>. ${note ? `<br/>Studio Note: ${note}` : ''}</p>`,
      });
    } catch (err) {
      console.warn('[Email Service] SMTP dispatch warning:', err.message);
    }
  }
};
