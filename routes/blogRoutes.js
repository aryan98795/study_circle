const express = require('express');
const { createPost, getPost, getPostById, updatePost, deletePost } = require('../controllers/blogController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();
const upload = require('../middleware/multer');

router.post('/', authMiddleware, createPost);
router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'कोई इमेज अपलोड नहीं की गई' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
});

router.get('/', getPost);
router.get('/:id', getPostById);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;