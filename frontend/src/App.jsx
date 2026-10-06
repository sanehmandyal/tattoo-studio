import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { Interactive3DPage } from './pages/Interactive3DPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { BookingPage } from './pages/BookingPage';
import { AftercarePage } from './pages/AftercarePage';
import { BlogPage } from './pages/BlogPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { ContactPage } from './pages/ContactPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { CalendarPage } from './pages/CalendarPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';

// Admin
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminBookings } from './admin/AdminBookings';
import { AdminPortfolio } from './admin/AdminPortfolio';
import { AdminDesigns } from './admin/AdminDesigns';
import { AdminReviews } from './admin/AdminReviews';
import { AdminAftercare } from './admin/AdminAftercare';
import { AdminBlogs } from './admin/AdminBlogs';
import { AdminContacts } from './admin/AdminContacts';
import { AdminSettings } from './admin/AdminSettings';
import { AdminCalendar } from './admin/AdminCalendar';
import { FloatingWhatsAppButton } from './components/common/FloatingWhatsAppButton';

export const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-studio-bg text-studio-textMain flex flex-col justify-between selection:bg-studio-bronze selection:text-black">
      {!isAdminRoute && <Navbar />}

      <div className="flex-1 relative">
        <Routes>
          {/* Public Pages matching Admin Modules */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/interactive-3d" element={<Interactive3DPage />} />
          <Route path="/designs" element={<Interactive3DPage />} />
          <Route path="/3d-designs" element={<Interactive3DPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/gallery" element={<PortfolioPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/testimonials" element={<ReviewsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/schedule" element={<CalendarPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/aftercare" element={<AftercarePage />} />
          <Route path="/aftercare-guide" element={<AftercarePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/journal" element={<BlogPage />} />
          <Route path="/blog/:slugOrId" element={<BlogDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Legacy Artists redirects to Portfolio */}
          <Route path="/artists" element={<Navigate to="/portfolio" replace />} />
          <Route path="/artists/:slugOrId" element={<Navigate to="/portfolio" replace />} />

          {/* Admin Protected Portal */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="portfolio" element={<AdminPortfolio />} />
            <Route path="designs" element={<AdminDesigns />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="aftercare" element={<AdminAftercare />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="calendar" element={<AdminCalendar />} />
            {/* Legacy admin/artists redirect to admin/portfolio */}
            <Route path="artists" element={<Navigate to="/admin/portfolio" replace />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* Global Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!isAdminRoute && <Footer />}

      {/* Floating WhatsApp Quick Connect Widget */}
      {!isAdminRoute && <FloatingWhatsAppButton />}
    </div>
  );
};
