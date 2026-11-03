const Blog = require('../models/blog');

exports.getHome = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate('author', 'username profileImage')
            .sort({ createdAt: -1 });
        res.render('index', {
            title: 'Blogging App',
            user: req.user || null,
            blogs,
        });
    } catch (error) {
        res.status(500).render('index', {
            title: 'Blogging App',
            user: req.user || null,
            blogs: [],
            error: error.message,
        });
    }
};

exports.getDashboard = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user.id })
            .populate('author', 'username profileImage')
            .sort({ createdAt: -1 });
        res.render('dashboard', { title: 'Dashboard', user: req.user, blogs });
    } catch (error) {
        res.status(500).render('dashboard', {
            title: 'Dashboard',
            user: req.user,
            blogs: [],
            error: error.message,
        });
    }
};

exports.getBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'username profileImage')
            .populate('likes', '_id')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'username profileImage' },
                options: { sort: { createdAt: 1 } },
            });

        if (!blog) {
            return res.status(404).render('blog', {
                title: 'Blog not found',
                user: req.user || null,
                blog: null,
            });
        }

        return res.render('blog', { title: blog.title, user: req.user || null, blog });
    } catch (error) {
        return res.status(404).render('blog', {
            title: 'Blog not found',
            user: req.user || null,
            blog: null,
        });
    }
};

// Create a new blog
exports.createBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        const blog = new Blog({
            title,
            content,
            author: req.user.id,
            coverImage: req.file ? `/uploads/${req.user.id}/${req.file.filename}` : '',
        });

        await blog.save();
        return res.redirect('/dashboard');
    } catch (error) {
        const blogs = await Blog.find({ author: req.user.id })
            .populate('author', 'username profileImage')
            .sort({ createdAt: -1 });
        return res.status(400).render('dashboard', {
            title: 'Dashboard',
            user: req.user,
            blogs,
            error: error.message,
        });
    }
};

// Update blog
exports.updateBlog = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const blog = await Blog.findOne({ _id: id, author: req.user.id });
        if (!blog) {
            return res.sendStatus(404);
        }

        blog.title = title;
        blog.content = content;
        await blog.save();
        return res.redirect('/dashboard');
    } catch (error) {
        const blogs = await Blog.find({ author: req.user.id })
            .populate('author', 'username profileImage')
            .sort({ createdAt: -1 });
        return res.status(400).render('dashboard', {
            title: 'Dashboard',
            user: req.user,
            blogs,
            error: error.message,
        });
    }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await Blog.findOne({ _id: id, author: req.user.id });
        if (!blog) {
            return res.sendStatus(404);
        }

        await blog.deleteOne();
        return res.redirect('/dashboard');
    } catch (error) {
        return res.status(400).send('Could not delete the blog.');
    }
};

// Like a blog
exports.likeBlog = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.redirect(`/blog/${id}`);
        }

        // Toggle like
        if (blog.likes.some((likeId) => likeId.toString() === userId)) {
            blog.likes = blog.likes.filter((likeId) => likeId.toString() !== userId);
        } else {
            blog.likes.push(userId);
        }

        await blog.save();
        return res.redirect(`/blog/${id}`);
    } catch (error) {
        return res.status(400).send('Could not update the like.');
    }
};