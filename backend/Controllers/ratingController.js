const db = require('../database/index');
const Explorer = db.Explorer;
const Rating = db.Rating;

// Create a rating
const createRating = async (req, res) => {
  const { idposts, explorer_idexplorer, rating } = req.body;

  try {
    const newRating = await Rating.create({
      posts_idposts: idposts,
      explorer_idexplorer,
      rating,
    });

    res.status(201).json(newRating);
  } catch (error) {
    console.error('Error creating rating:', error);
    res.status(500).json({ error: 'Failed to create rating' });
  }
};

// Get ratings for a post
const getRatingsForPost = async (req, res) => {
  const { idposts } = req.params;

  try {
    const ratings = await Rating.findAll({
      where: { posts_idposts: idposts },
      include: [{ model: Explorer, attributes: ['idexplorer', 'username'] }],
    });

    res.status(200).json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
};

// Update a rating
const updateRating = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  try {
    const updatedRating = await Rating.update(
      { rating },
      { where: { idrating: id }, returning: true }
    );

    res.status(200).json(updatedRating[1][0]); // Return the updated rating object
  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({ error: 'Failed to update rating' });
  }
};

// Delete a rating
const deleteRating = async (req, res) => {
  const { id } = req.params;

  try {
    await Rating.destroy({ where: { idrating: id } });

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).json({ error: 'Failed to delete rating' });
  }
};

module.exports = {
  createRating,
  getRatingsForPost,
  updateRating,
  deleteRating
};
