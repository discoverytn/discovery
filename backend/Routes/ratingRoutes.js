const express = require('express');
const router = express.Router();
const {
    createRating,
    getRatingsForPost,
    updateRating,
    deleteRating  
    
  } = require('../Controllers/ratingController.js');
// Routes for ratings
router.post('/rate', createRating);
router.get('/rate/:postId/rating', getRatingsForPost);
router.put('/rate/:id', updateRating);
router.delete('/rate/:id', deleteRating);

module.exports = router;
