import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogsAPI } from '../../services/api';
import { Clock, User, ArrowRight, BookOpen } from 'lucide-react';
import { getFullImageUrl } from '../../utils/imageHelper';

export const getArticleCoverImage = (blog) => {
  const t = (blog?.title || '').toLowerCase();
  const s = (blog?.slug || '').toLowerCase();
  const c = (blog?.category || '').toLowerCase();

  // 1. Mahadev / Shiva / Sacred Devbhoomi / Sacred Geometry — Distinct Spiritual Sacred Mandala Photography
  if (t.includes('mahadev') || t.includes('shiva') || t.includes('trishul') || s.includes('mahadev') || s.includes('sacred-geometry') || t.includes('geometry') || c.includes('style')) {
    return 'https://images.unsplash.com/photo-1611590027211-b954fd027b51?auto=format&fit=crop&w=1000&q=80';
  }
  // 2. Tattoo Preparation / Session Prep / Hydration / Skin Prep — Real Studio Artist Inking Session
  if (t.includes('prep') || t.includes('prepare') || s.includes('prep') || c.includes('prep') || t.includes('session')) {
    return 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1000&q=80';
  }
  // 3. Aftercare / Contrast / Longevity / Healing / Science — Clean Skin Barrier Balm & Aftercare
  if (t.includes('aftercare') || t.includes('contrast') || t.includes('longevity') || s.includes('contrast') || s.includes('aftercare') || c.includes('aftercare') || t.includes('science')) {
    return 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80';
  }

  return blog?.coverImage || 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1000&q=80';
};

const DEFAULT_BLOGS = [
  {
    _id: 'b1',
    title: 'How to Prepare Your Body and Skin for a Multi-Hour Tattoo Session',
    slug: 'prep-your-body-for-tattoo-session',
    excerpt: 'Hydration, nutrition, skin prep, and breathing techniques to maximize endurance and comfort in the chair.',
    coverImage: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1000&q=80',
    category: 'Tattoo Preparation',
    readTimeMinutes: 5,
    author: 'Master Sunil',
  },
  {
    _id: 'b2',
    title: 'The Sacred Architecture of Mahadev Trishul & Devbhoomi Geometry',
    slug: 'sacred-geometry-devbhoomi-art',
    excerpt: 'Exploring the spiritual symbolism of Lord Shiva, the cosmic trident, and sacred golden-ratio yantras.',
    coverImage: 'https://images.unsplash.com/photo-1611590027211-b954fd027b51?auto=format&fit=crop&w=1000&q=80',
    category: 'Sacred Devbhoomi',
    readTimeMinutes: 4,
    author: 'Master Sunil',
  },
  {
    _id: 'b3',
    title: 'Medical Aftercare: Preserving Long-Term Ink Contrast and Sharpness',
    slug: 'preserving-contrast-tattoo-longevity',
    excerpt: 'Understanding UV photodegradation, proper skin barrier healing, and lifetime tattoo vibrance.',
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80',
    category: 'Tattoo Aftercare',
    readTimeMinutes: 6,
    author: 'Aman Verma',
  },
];

export const BlogSection = () => {
  const [blogs, setBlogs] = useState(DEFAULT_BLOGS);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await blogsAPI.getAll({ limit: 3 });
        if (res.success && res.blogs?.length > 0) {
          const mapped = res.blogs.map(b => ({
            ...b,
            coverImage: getArticleCoverImage(b)
          }));
          setBlogs(mapped);
        }
      } catch (err) {
        // Fallback to default
      }
    };
    fetchBlogs();
  }, []);

  return (
    <section id="blog" className="py-20 bg-studio-secondary/20 relative border-t border-b border-white/5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 border-b border-white/10 pb-4">
          <div className="text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Articles &amp; Guides
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Studio Journal &amp; Insights
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Expert advice on tattoo care, preparation, and styling by Master Sunil
            </p>
          </div>
          <Link
            to="/blog"
            className="mt-4 sm:mt-0 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 flex items-center space-x-1"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.slice(0, 3).map((blog) => (
            <article
              key={blog._id}
              className="bg-zinc-900/80 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/40 transition-all flex flex-col justify-between group shadow-md"
            >
              <div className="relative h-48 overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={getFullImageUrl(getArticleCoverImage(blog))}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1000&q=80';
                  }}
                />
                <span className="absolute top-3 left-3 bg-black/85 backdrop-blur-md text-[10px] font-bold text-amber-300 uppercase tracking-wider px-2.5 py-1 rounded-md border border-amber-500/30">
                  {blog.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-[11px] text-zinc-400">
                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      <span>{blog.author}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{blog.readTimeMinutes} min read</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5">
                  <Link
                    to={`/blog/${blog.slug || blog._id}`}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
