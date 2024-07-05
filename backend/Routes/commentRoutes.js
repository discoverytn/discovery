const express = require('express');
const router = express.Router();
const {
  createComment,
  getCommentsForPost,
  updateComment,
  deleteComment,
  getUserComments
} = require('../Controllers/commentsController.js');

router.post('/create', createComment);
router.get('/post/:idposts', getCommentsForPost);
router.put('/:idcomments', updateComment);
router.delete('/:idcomments', deleteComment);
router.get('/user/:userId', getUserComments);

module.exports = router;