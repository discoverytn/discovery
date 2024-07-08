const express = require('express');
const router = express.Router();
const {
  createOrUpdateRating,
  getUserRating,
  getRatingsForPost,
  updateRating,
  deleteRating
} = require('../Controllers/ratingController.js');

router.post('/rate', createOrUpdateRating);
router.post('/user-rating', getUserRating);
router.get('/post/:idposts', getRatingsForPost);
router.put('/:id', updateRating);
router.delete('/:id', deleteRating);

module.exports = router;