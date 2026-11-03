const Comment = require('../models/comment');
const Blog = require('../models/blog');

exports.addComment = async (req, res) => {
    const { blogId } = req.params;
    const { content } = req.body;

    if (typeof content !== 'string' || !content.trim()) {
        return res.status(400).redirect(`/blog/${blogId}`);
    }

    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.sendStatus(404);
        }

        const comment = await Comment.create({
            content: content.trim(),
            author: req.user.id,
            blog: blog._id,
        });

        blog.comments.push(comment._id);
        await blog.save();

        return res.redirect(`/blog/${blogId}`);
    } catch (error) {
        return res.status(500).send('Could not add the comment.');
    }
};

exports.deleteComment = async (req, res) => {
    const { blogId, commentId } = req.params;

    try {
        const comment = await Comment.findOne({ _id: commentId, blog: blogId });
        if (!comment) {
            return res.sendStatus(404);
        }

        if (comment.author.toString() !== String(req.user.id)) {
            return res.sendStatus(403);
        }

        await Blog.updateOne(
            { _id: blogId },
            { $pull: { comments: comment._id } }
        );
        await comment.deleteOne();

        return res.redirect(`/blog/${blogId}`);
    } catch (error) {
        return res.status(500).send('Could not delete the comment.');
    }
};

exports.getCommentsByBlog = async (blogId) => {
    return Comment.find({ blog: blogId })
        .populate('author', 'username profileImage')
        .sort({ createdAt: 1 });
};
