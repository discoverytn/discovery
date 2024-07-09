const express = require('express');
const router = express.Router();
const {
  getAllExplorerPosts,
  ExplorerCreatePost,
  BusinessCreatePost,
  ExplorerUpdatePost,
  BusinessUpdatePost,
  ExplorerDeletePost,
  BusinessDeletePost,
  getAllPosts,
  getPostById,
  ratePost,
  getAllBusinessPosts,
  getTopFavoritePosts,
  deletePost
  
  
} = require('../Controllers/postController');

router.get('/explorer/posts', getAllExplorerPosts);

router.get('/business/posts', getAllBusinessPosts);

router.get('/top5', getTopFavoritePosts);


router.post('/explorer/add', ExplorerCreatePost);
router.delete('/delete/:idposts', deletePost);
router.post('/business/add', BusinessCreatePost);

router.put('/explorer/update/:id', ExplorerUpdatePost);

router.put('/business/update/:id', BusinessUpdatePost);

router.delete('/explorer/delete/:id', ExplorerDeletePost);

router.delete('/business/delete/:id', BusinessDeletePost);

router.get('/allposts', getAllPosts);

router.get('/onepost/:idposts', getPostById);

// route to rate a post
router.post('/ratepost', ratePost);

module.exports = router;
