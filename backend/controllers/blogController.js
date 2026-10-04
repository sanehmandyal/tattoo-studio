import Blog from '../models/Blog.js';

export const getBlogs = async (req, res, next) => {
  try {
    const { category, search, limit = 9, page = 1 } = req.query;
    const query = { isPublished: true };

    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: blogs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      blogs,
    });
  } catch (error) {
    next(error);
  }
};

export const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({
      $or: [{ slug: req.params.slugOrId }, { _id: req.params.slugOrId.match(/^[0-9a-fA-F]{24}$/) ? req.params.slugOrId : null }]
    });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    blog.views = (blog.views || 0) + 1;
    await blog.save();

    const related = await Blog.find({
      _id: { $ne: blog._id },
      category: blog.category,
      isPublished: true,
    }).limit(3);

    res.json({ success: true, blog, related });
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (req, res, next) => {
  try {
    const { title, excerpt, content, coverImage, author, category, tags, readTimeMinutes, isPublished, seoTitle, seoDescription } = req.body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const blog = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      coverImage,
      author: author || 'INK CARVERS Master Team',
      category: category || 'Tattoo Inspiration',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      readTimeMinutes: readTimeMinutes || 4,
      isPublished: isPublished !== undefined ? isPublished : true,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
    });

    res.status(201).json({ success: true, blog });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    if (typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map(t => t.trim());
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, blog });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    await blog.deleteOne();
    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    next(error);
  }
};
