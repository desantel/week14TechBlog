const router = require('express').Router();
const { Blog } = require('../../models');

router.post('/', async (req,res) => {
    try {
        const newBlog = await Blog.create({
            ...req.body,
            user_id: req.session.user_id,
        });
        res.status(200).json(newBlog);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const blogPost = await Blog.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });
        if (!blogPost) {
            res.status(404).json({ message: 'No post found' })
            return;
        }
        res.status(200).json(blogPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;