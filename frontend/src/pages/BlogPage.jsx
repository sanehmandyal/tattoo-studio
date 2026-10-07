import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { blogsAPI } from '../services/api';
import { Search, Clock, ArrowRight, User } from 'lucide-react';
import { getFullImageUrl } from '../utils/imageHelper';

export const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Tattoo Inspiration',
    'Tattoo Styles',
    'Tattoo Preparation',
    'Tattoo Aftercare',
    'Artist Stories',
    'Studio News',
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (search) params.search = search;
        const res = await blogsAPI.getAll(params);
        if (res.success) setBlogs(res.blogs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [selectedCategory, search]);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-studio-bg">
      <Helmet>
        <title>Sacred Ink Journal — Tattoo Guides, Symbolism &amp; Culture | LAND OF GOD TATTOO STUDIO (Una, HP)</title>
        <meta
          name="description"
          content="Read articles on sacred Mahadev Trishul symbolism, tattoo session preparation, pain management, Devbhoomi tattoo traditions, and long-term pigment care from Land of God Tattoo Studio in Una, Himachal Pradesh."
        />
        <meta name="keywords" content="Tattoo Blog Himachal Pradesh, Mahadev Tattoo Meaning, Sacred Geometry Tattoo Articles Una, Land of God Journal" />
      </Helmet>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-studio-gold font-serif">
            ॥ SACRED INK JOURNAL &amp; CULTURE ॥
          </span>
          <h1 className="ancient-carved-heading text-4xl sm:text-5xl uppercase tracking-tight text-studio-textMain">
            Sacred Ink Journal
          </h1>
          <p className="text-xs sm:text-sm text-studio-textMuted font-serif">
            Spiritual symbology, Devbhoomi heritage, master tattoo techniques, and longevity secrets from Friends Colony, Una (HP).
          </p>
        </div>

        {/* Filter bar */}
        <div className="glass-panel p-4 rounded-xl border border-studio-border/50 mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-studio-textMuted absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search articles, trends, guides..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-studio-card border border-studio-border rounded pl-9 pr-3 py-2 text-xs text-studio-textMain focus:outline-none focus:border-studio-bronze"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded transition-all ${
                    selectedCategory === cat
                      ? 'bg-studio-bronze text-studio-darker font-bold shadow-bronze'
                      : 'bg-studio-card text-studio-textMuted hover:text-studio-textMain'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs text-studio-textMuted">
            Loading articles...
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-20 text-center text-xs text-studio-textMuted">
            No articles found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="glass-card rounded-xl overflow-hidden border border-studio-border/40 hover:border-studio-bronze transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                <div className="relative h-56 overflow-hidden bg-black/90 flex items-center justify-center p-2">
                  <img
                    src={getFullImageUrl(blog.coverImage)}
                    alt={blog.title}
                    className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                      blog.coverImage?.includes('/tattoos/') ? 'object-contain p-2' : 'object-cover'
                    }`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/tattoos/mahadev_trishul.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-studio-card/80 via-transparent to-transparent opacity-70 pointer-events-none" />
                  <span className="absolute top-3 left-3 bg-studio-darker/90 text-[10px] font-bold text-studio-bronzeLight uppercase tracking-wider px-2.5 py-1 rounded border border-studio-border/40">
                    {blog.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center space-x-3 text-xs text-studio-textMuted mb-2">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-studio-bronze" />
                        <span>{blog.readTimeMinutes || 4} min read</span>
                      </span>
                      <span>•</span>
                      <span className="truncate">{blog.author}</span>
                    </div>

                    <h2 className="font-display font-bold text-lg text-studio-textMain uppercase line-clamp-2 group-hover:text-studio-bronzeLight transition-colors">
                      {blog.title}
                    </h2>

                    <p className="text-xs text-studio-textMuted mt-2 line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-studio-border/30">
                    <Link
                      to={`/blog/${blog.slug || blog._id}`}
                      className="text-xs font-bold text-studio-bronzeLight hover:text-studio-textMain flex items-center space-x-1 group/link"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
