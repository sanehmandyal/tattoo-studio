import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogsAPI } from '../../services/api';
import { Clock, User, ArrowRight, BookOpen } from 'lucide-react';

const DEFAULT_BLOGS = [
  {
    _id: 'b1',
    title: 'How to Prepare Your Body and Mind for a Multi-Hour Session',
    slug: 'prep-your-body-for-tattoo-session',
    excerpt: 'Hydration, carb loading, skin prep, and breathing techniques to maximize endurance in the chair.',
    coverImage: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=600&q=80',
    category: 'Tattoo Preparation',
    readTimeMinutes: 5,
    author: 'ELIZA — Master Resident',
  },
  {
    _id: 'b2',
    title: 'The Architecture of Sacred Geometry & Dotwork Alchemy',
    slug: 'sacred-geometry-and-dotwork-alchemy',
    excerpt: 'Exploring the mathematical harmony of the golden ratio, Metatrons cube, and meditative pointillism.',
    coverImage: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?auto=format&fit=crop&w=600&q=80',
    category: 'Tattoo Styles',
    readTimeMinutes: 4,
    author: 'MARK — Geometric Resident',
  },
  {
    _id: 'b3',
    title: 'Preserving Contrast: The Science of Tattoo Longevity and Aftercare',
    slug: 'preserving-contrast-tattoo-longevity',
    excerpt: 'Understanding UV photodegradation, immune macrophage ink lock-in, and lifelong pigment brilliance.',
    coverImage: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=600&q=80',
    category: 'Tattoo Aftercare',
    readTimeMinutes: 6,
    author: 'LIAM — Senior Resident',
  },
];

export const BlogSection = () => {
  const [blogs, setBlogs] = useState(DEFAULT_BLOGS);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await blogsAPI.getAll({ limit: 3 });
        if (res.success && res.blogs?.length > 0) {
          setBlogs(res.blogs);
        }
      } catch (err) {
        console.log('Using default blog posts');
      }
    };
    fetchBlogs();
  }, []);

  return (
    <section id="blog" className="py-20 bg-studio-bg relative border-t border-studio-border/30">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 border-b border-studio-border/30 pb-4 lg:pl-4">
          <div>
            <h2 className="ancient-carved-heading text-2xl sm:text-3xl font-black tracking-widest text-studio-gold uppercase">
              ॥ ७. INK WELL JOURNAL &amp; WISDOM ॥
            </h2>
            <p className="text-studio-bronzeLight text-xs font-serif tracking-widest mt-1 uppercase">
              Sacred Philosophy, Preparation Guides &amp; Tattoo Culture
            </p>
          </div>
          <Link
            to="/blog"
            className="mt-4 sm:mt-0 text-xs font-bold uppercase tracking-widest text-studio-textMuted hover:text-studio-bronzeLight flex items-center space-x-1"
          >
            <span>Read All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Blog Cards (Matches Reference Section 7) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.slice(0, 3).map((blog) => (
            <article
              key={blog._id}
              className="glass-card rounded-xl overflow-hidden border border-studio-border/40 hover:border-studio-bronze transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative h-48 overflow-hidden bg-studio-card">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-studio-card via-transparent to-transparent opacity-90" />
                <span className="absolute top-3 left-3 bg-studio-darker/80 backdrop-blur-md text-[10px] font-bold text-studio-bronzeLight uppercase tracking-wider px-2.5 py-1 rounded border border-studio-border/40">
                  {blog.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center space-x-3 text-[11px] text-studio-textMuted mb-2">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-studio-bronze" />
                      <span>{blog.readTimeMinutes || 4} min read</span>
                    </span>
                    <span>•</span>
                    <span className="truncate">{blog.author}</span>
                  </div>

                  <h3 className="font-display font-bold text-base text-studio-textMain uppercase line-clamp-2 group-hover:text-studio-bronzeLight transition-colors">
                    {blog.title}
                  </h3>

                  <p className="text-xs text-studio-textMuted mt-2 line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-studio-border/30">
                  <Link
                    to={`/blog/${blog.slug || blog._id}`}
                    className="text-xs font-bold text-studio-bronzeLight hover:text-studio-textMain flex items-center space-x-1 group/link"
                  >
                    <span>Read Story</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform" />
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
