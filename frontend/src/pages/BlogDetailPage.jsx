import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { blogsAPI } from '../services/api';
import { Clock, User, ArrowLeft, Share2, Tag, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { getFullImageUrl } from '../utils/imageHelper';

export const BlogDetailPage = () => {
  const { slugOrId } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await blogsAPI.getBySlug(slugOrId);
        if (res.success) {
          setBlog(res.blog);
          setRelated(res.related || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slugOrId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Article link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 text-center text-studio-textMuted bg-studio-bg">
        Loading article...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen pt-32 text-center text-studio-textMuted bg-studio-bg space-y-4">
        <h2 className="text-2xl font-bold text-studio-textMain">Article Not Found</h2>
        <Link to="/blog" className="text-studio-bronzeLight hover:underline">
          ← Back to Blog Journal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-studio-bg">
      <Helmet>
        <title>{blog.seoTitle || blog.title} — LAND OF GOD TATTOO STUDIO Journal</title>
        <meta name="description" content={blog.seoDescription || blog.excerpt} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:image" content={blog.coverImage} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link
          to="/blog"
          className="inline-flex items-center space-x-2 text-xs font-bold text-studio-textMuted hover:text-studio-bronzeLight uppercase tracking-wider mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </Link>

        {/* Header Content */}
        <div className="space-y-4 mb-8">
          <span className="text-xs uppercase tracking-widest font-bold text-studio-bronzeLight bg-studio-card px-3 py-1 rounded border border-studio-border/40 inline-block">
            {blog.category}
          </span>
          <h1 className="font-condensed font-black text-3xl sm:text-5xl uppercase tracking-tight text-studio-textMain leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between text-xs text-studio-textMuted border-t border-b border-studio-border/30 py-3 gap-4">
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-studio-textMain">{blog.author}</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-studio-bronze" />
                <span>{blog.readTimeMinutes || 4} min read</span>
              </span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center space-x-1.5 text-studio-bronzeLight hover:text-studio-textMain transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Article</span>
            </button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden border border-studio-border shadow-2xl mb-10 h-80 sm:h-[420px] bg-black/90 flex items-center justify-center p-4">
          <img
            src={getFullImageUrl(blog.coverImage)}
            alt={blog.title}
            className={`w-full h-full ${
              blog.coverImage?.includes('/tattoos/') ? 'object-contain p-4' : 'object-cover'
            }`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/tattoos/mahadev_trishul.png';
            }}
          />
        </div>

        {/* Markdown / Formatted Story Content */}
        <div className="prose prose-invert max-w-none text-studio-textMuted leading-relaxed space-y-6 text-sm sm:text-base font-sans">
          {blog.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="font-condensed font-bold text-2xl text-studio-textMain uppercase tracking-wide pt-4 text-bronze-gradient">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            return (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="pt-8 mt-12 border-t border-studio-border/30 flex items-center space-x-2 flex-wrap gap-2">
            <Tag className="w-4 h-4 text-studio-bronze" />
            {blog.tags.map((tag, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded bg-studio-card text-studio-textMuted border border-studio-border/30">
                #{tag}
              </span>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
