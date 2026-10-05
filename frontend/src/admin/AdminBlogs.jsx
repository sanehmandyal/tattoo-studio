import React, { useState, useEffect } from 'react';
import { blogsAPI } from '../services/api';
import { Plus, Edit, Trash2, BookOpen, Clock, Upload } from 'lucide-react';
import { toast } from 'sonner';

export const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tattoo Inspiration');
  const [author, setAuthor] = useState('Land of God Studio Editorial');
  const [coverImage, setCoverImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('Sacred, Devbhoomi, Tattoo');
  const [readTimeMinutes, setReadTimeMinutes] = useState(4);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = () => {
      setCoverImage(reader.result);
      toast.success('Article cover photo loaded and ready to save!');
      setUploadingImage(false);
    };
    reader.onerror = () => {
      toast.error('Failed to process image file');
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const res = await blogsAPI.getAll({ limit: 50 });
      if (res.success) setBlogs(res.blogs);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const openCreateModal = () => {
    setEditingBlog(null);
    setTitle('');
    setCategory('Tattoo Inspiration');
    setAuthor('Land of God Studio Editorial');
    setCoverImage('https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80');
    setExcerpt('');
    setContent('');
    setTags('Sacred, Devbhoomi, Tattoo');
    setReadTimeMinutes(4);
    setModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setCategory(blog.category);
    setAuthor(blog.author);
    setCoverImage(blog.coverImage);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setTags((blog.tags || []).join(', '));
    setReadTimeMinutes(blog.readTimeMinutes || 4);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !coverImage || !excerpt || !content) {
      toast.error('Please fill required fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title,
        category,
        author,
        coverImage,
        excerpt,
        content,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        readTimeMinutes: Number(readTimeMinutes),
      };

      if (editingBlog) {
        await blogsAPI.update(editingBlog._id, payload);
        toast.success(`Article "${title}" updated!`);
      } else {
        await blogsAPI.create(payload);
        toast.success(`Article "${title}" published!`);
      }
      setModalOpen(false);
      loadBlogs();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, blogTitle) => {
    if (!window.confirm(`Delete article "${blogTitle}"?`)) return;
    try {
      await blogsAPI.delete(id);
      toast.success('Article deleted');
      loadBlogs();
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-studio-border/30 pb-4">
        <div>
          <h1 className="font-condensed font-black text-3xl uppercase tracking-wider text-studio-textMain">
            Ink Well Blog Editor
          </h1>
          <p className="text-xs text-studio-textMuted">
            Create and edit tattoo culture stories, preparation guides, and aftercare journalism.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-studio-bronze hover:bg-studio-bronzeLight text-white font-condensed font-bold px-4 py-2 text-xs uppercase tracking-wider rounded shadow-bronze flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-studio-textMuted">Loading articles...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="glass-card rounded-xl overflow-hidden border border-studio-border/50 shadow-xl flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden bg-studio-card">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 bg-studio-darker/80 text-[10px] font-bold text-studio-bronzeLight uppercase px-2 py-0.5 rounded">
                  {blog.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-condensed font-bold text-lg text-studio-textMain uppercase line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-studio-textMuted mt-1 line-clamp-2">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-studio-border/30 flex items-center justify-between text-xs text-studio-textMuted">
                  <span>{blog.readTimeMinutes} min read</span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => openEditModal(blog)}
                      className="p-1 rounded border border-studio-border hover:border-studio-bronze text-studio-bronzeLight"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id, blog.title)}
                      className="p-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full bg-studio-card border border-studio-border rounded-xl p-6 shadow-2xl space-y-4 my-8">
            <h3 className="font-condensed font-bold text-2xl text-studio-textMain uppercase">
              {editingBlog ? 'Edit Studio Article' : 'Compose New Article'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-left text-xs">
              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">Article Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How to Prepare Your Body for a Multi-Hour Session"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-studio-textMuted uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                  >
                    <option value="Tattoo Inspiration">Tattoo Inspiration</option>
                    <option value="Tattoo Styles">Tattoo Styles</option>
                    <option value="Tattoo Preparation">Tattoo Preparation</option>
                    <option value="Tattoo Aftercare">Tattoo Aftercare</option>
                    <option value="Artist Stories">Artist Stories</option>
                    <option value="Studio News">Studio News</option>
                    <option value="Tattoo Trends">Tattoo Trends</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-studio-textMuted uppercase mb-1">Author Credit</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                  />
                </div>
              </div>

              {/* Cover Image Upload / URL */}
              <div className="space-y-2 border border-studio-border/50 bg-studio-secondary/60 p-3 rounded-lg">
                <label className="block font-bold text-studio-textMuted uppercase">Article Cover Image</label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      required
                      placeholder="Image URL or upload file below"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="w-full bg-studio-card border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                    />
                  </div>
                  <div className="shrink-0">
                    <label className="cursor-pointer bg-studio-card border border-studio-border hover:border-studio-gold text-studio-gold px-3 py-2 rounded flex items-center space-x-1.5 text-xs font-semibold">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Loading...' : 'Upload Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {coverImage && (
                  <div className="mt-2 relative w-32 h-20 rounded-lg overflow-hidden border border-studio-gold/40">
                    <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">Summary Excerpt</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Short engaging excerpt for listing cards..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain focus:outline-none focus:border-studio-bronze"
                />
              </div>

              <div>
                <label className="block font-bold text-studio-textMuted uppercase mb-1">Full Article Body (Markdown supported)</label>
                <textarea
                  rows="8"
                  required
                  placeholder="Write story content. Use ### for subheadings..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-studio-secondary border border-studio-border rounded px-3 py-2 text-studio-textMain font-mono focus:outline-none focus:border-studio-bronze"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-studio-border/30">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-studio-textMuted hover:text-studio-textMain"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-studio-bronze hover:bg-studio-bronzeLight text-studio-darker font-bold px-5 py-2 uppercase tracking-wider rounded shadow-bronze"
                >
                  {submitting ? 'Saving...' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
