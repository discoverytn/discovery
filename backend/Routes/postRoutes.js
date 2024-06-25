const express = require('express');
const router = express.Router();
const { ExplorerCreatePost, BusinessCreatePost, ExplorerUpdatePost, BusinessUpdatePost, ExplorerDeletePost, BusinessDeletePost } = require('../Controllers/postController');

// POST /api/posts/explorer/add - Create a new post for explorer
router.post('/explorer/add', ExplorerCreatePost);

// POST /api/posts/business/add - Create a new post for business
router.post('/business/add', BusinessCreatePost);

// PUT /api/posts/explorer/update/:id - Update a post by ID for explorer
router.put('/explorer/update/:id', ExplorerUpdatePost);

// PUT /api/posts/business/update/:id - Update a post by ID for business
router.put('/business/update/:id', BusinessUpdatePost);

// DELETE /api/posts/explorer/delete/:id - Delete a post by ID for explorer
router.delete('/explorer/delete/:id', ExplorerDeletePost);

// DELETE /api/posts/business/delete/:id - Delete a post by ID for business
router.delete('/business/delete/:id', BusinessDeletePost);

module.exports = router;
