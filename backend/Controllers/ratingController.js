const db = require('../database/index');
const Explorer = db.Explorer;
const Rating = db.Rating;
const Post = db.Posts; 

// to create or update a rating
const createOrUpdateRating = async (req, res) => {
  const { idposts, explorer_idexplorer, rating } = req.body;

  try {
    //  to find an existing rating
    let ratingRecord = await Rating.findOne({
      where: { posts_idposts: idposts, explorer_idexplorer },
    });

    if (ratingRecord) {
      // if a rating exists, update it
      await ratingRecord.update({ rating });
    } else {
      // andd if no rating exists, create a new one
      ratingRecord = await Rating.create({
        posts_idposts: idposts,
        explorer_idexplorer,
        rating,
      });
    }

    // to calculate new average rating
    const avgRatingResult = await Rating.findOne({
      where: { posts_idposts: idposts },
      attributes: [
        [db.sequelize.fn('AVG', db.sequelize.col('rating')), 'averageRating'],
        [db.sequelize.fn('COUNT', db.sequelize.col('rating')), 'numOfRatings'],
        [db.sequelize.fn('SUM', db.sequelize.col('rating')), 'totalRating'],
      ],
      raw: true,
    });

    // to update post with new ratings data
    await Post.update(
      {
        averageRating: parseFloat(avgRatingResult.averageRating).toFixed(1),
        numOfRatings: avgRatingResult.numOfRatings,
        totalRating: avgRatingResult.totalRating,
      },
      { where: { idposts } }
    );

    // here w fetch the updated post
    const updatedPost = await Post.findByPk(idposts);

    res.status(201).json({
      message: ratingRecord._options.isNewRecord ? 'Rating created' : 'Rating updated',
      rating: ratingRecord,
      averageRating: updatedPost.averageRating,
      numOfRatings: updatedPost.numOfRatings,
      totalRating: updatedPost.totalRating,
    });
  } catch (error) {
    console.error('Error creating/updating rating:', error);
    res.status(500).json({ error: 'Failed to create/update rating' });
  }
};


// to get user's rating for a specific post
const getUserRating = async (req, res) => {
  const { idposts, explorer_idexplorer } = req.body;
  console.log('Fetching rating for post:', idposts, 'and explorer:', explorer_idexplorer);

  try {
    const rating = await Rating.findOne({
      where: { posts_idposts: idposts, explorer_idexplorer },
    });

    console.log('Found rating:', rating);

    res.status(200).json(rating || { rating: 0 });
  } catch (error) {
    console.error('Error fetching user rating:', error);
    res.status(500).json({ error: 'Failed to fetch user rating' });
  }
};

const getRatingsForPost = async (req, res) => {
  const { idposts } = req.params;

  try {
    const ratings = await Rating.findAll({
      where: { posts_idposts: idposts },
      include: [{ model: Explorer, attributes: ['idexplorer', 'username'] }],
    });

    // to calculate average rating
    const avgRating = await Rating.findOne({
      where: { posts_idposts: idposts },
      attributes: [[db.sequelize.fn('AVG', db.sequelize.col('rating')), 'averageRating']],
      raw: true,
    });

    res.status(200).json({
      ratings,
      averageRating: avgRating ? avgRating.averageRating : 0
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
};

// to update a rating
const updateRating = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  try {
    const updatedRating = await Rating.update(
      { rating },
      { where: { idrating: id }, returning: true }
    );

    res.status(200).json(updatedRating[1][0]); // to return the updated rating object
  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({ error: 'Failed to update rating' });
  }
};

// to delete a rating
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
  createOrUpdateRating,
  getUserRating,
  getRatingsForPost,
  updateRating,
  deleteRating
};