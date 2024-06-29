const express = require('express');
const router = express.Router();
const {
  ExplorerCreatePost,
  BusinessCreatePost,
  ExplorerUpdatePost,
  BusinessUpdatePost,
  ExplorerDeletePost,
  BusinessDeletePost,
  getAllPosts,
} = require('../Controllers/postController');


router.post('/explorer/add', ExplorerCreatePost);


router.post('/business/add', BusinessCreatePost);

router.put('/explorer/update/:id', ExplorerUpdatePost);

router.put('/business/update/:id', BusinessUpdatePost);

router.delete('/explorer/delete/:id', ExplorerDeletePost);

router.delete('/business/delete/:id', BusinessDeletePost);

router.get('/allposts', getAllPosts);

module.exports = router;
