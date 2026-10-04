import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Hero } from '../components/home/Hero';
import { AboutSection } from '../components/home/AboutSection';
import { PortfolioSection } from '../components/home/PortfolioSection';
import { BookingSection } from '../components/home/BookingSection';
import { AftercareSection } from '../components/home/AftercareSection';
import { BlogSection } from '../components/home/BlogSection';
import { ReviewsSection } from '../components/home/ReviewsSection';
import { ContactSection } from '../components/home/ContactSection';
import { LeftVerticalBar } from '../components/layout/LeftVerticalBar';

export const HomePage = () => {
  return (
    <div className="relative min-h-screen">
      <Helmet>
        <title>LAND OF GOD TATTOO STUDIO — Premier Sacred & Custom Tattoo Atelier | Una, Himachal Pradesh</title>
        <meta
          name="description"
          content="Land of God Tattoo Studio in Una, Himachal Pradesh. Sacred Mahadev Trishul artistry, 3D placement lab, sterile clinical hygiene, and master tattooists."
        />
        <meta property="og:title" content="LAND OF GOD TATTOO STUDIO — Una, Himachal Pradesh" />
        <meta property="og:description" content="Your Vision, Sacred Ink. Devbhoomi's premier tattoo studio in Una, HP." />
      </Helmet>

      {/* Iconic Left Vertical Navigation Bar */}
      <LeftVerticalBar />

      {/* Main Sections Stream */}
      <main className="lg:pl-12">
        <Hero />
        <AboutSection />
        <PortfolioSection />
        <ReviewsSection />
        <BookingSection />
        <AftercareSection />
        <BlogSection />
        <ContactSection />
      </main>
    </div>
  );
};
