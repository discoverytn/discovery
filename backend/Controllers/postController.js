const db = require('../database/index');
const Posts = db.Posts;
const Explorer = db.Explorer;

const ExplorerCreatePost = async (req, res) => {
  const { title, description, hashtags, location, long, latt, image1, image2, image3, image4, category, explorer_idexplorer } = req.body;

  try {
    const post = await Posts.create({
      title,
      description,
      hashtags: hashtagsToString(hashtags),
      location,
      long,
      latt,
      image1,
      image2,
      image3,
      image4,
      category,
      explorer_idexplorer,
    });

    // Update numOfPosts in Explorer model
    await updateExplorerNumOfPosts(explorer_idexplorer);

    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating explorer post:", error);
    res.status(500).json({ error: "Failed to create explorer post" });
  }
};

// Function to update numOfPosts in Explorer model
const updateExplorerNumOfPosts = async (explorerId) => {
  try {
    const count = await Posts.count({ where: { explorer_idexplorer: explorerId } });
    const explorer = await Explorer.findByPk(explorerId);

    if (explorer) {
      explorer.numOfPosts = count;
      await explorer.save();
    }
  } catch (error) {
    console.error("Error updating numOfPosts in Explorer model:", error);
  }
};

function hashtagsToString(hashtags) {
  return Array.isArray(hashtags) ? hashtags.join(', ') : hashtags;
}

const BusinessCreatePost = async (req, res) => {
  const { title, description, hashtags, location, long, latt, image1, image2, image3, image4, category, business_idbusiness } = req.body;

  try {
    const post = await Posts.create({
      title,
      description,
      hashtags: hashtagsToString(hashtags),
      location,
      long,
      latt,
      image1,
      image2,
      image3,
      image4,
      category,
      business_idbusiness,
    });

    // Increase numOfPosts in Business model
    const business = await db.Business.findByPk(business_idbusiness);
    if (business) {
      business.numOfPosts += 1;
      await business.save();
    }

    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating business post:", error);
    res.status(500).json({ error: "Failed to create business post" });
  }
};


const ExplorerUpdatePost = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags, location, long, latt, image1, image2, image3, image4, category } = req.body;

  try {
    const post = await Posts.findOne({ where: { idposts: id } });

    if (post && post.explorer_idexplorer !== null) {
      post.title = title;
      post.description = description;
      post.hashtags = hashtagsToString(hashtags);
      post.location = location;
      post.long = long;
      post.latt = latt;
      post.image1 = image1 || post.image1; 
      post.image2 = image2 || post.image2;
      post.image3 = image3 || post.image3;
      post.image4 = image4 || post.image4;
      post.category = category;

      await post.save();

      res.status(200).json(post);
    } else {
      res.status(404).json({ error: "Post not found or not associated with an explorer" });
    }
  } catch (error) {
    console.error("Error updating explorer post:", error);
    res.status(500).json({ error: "Failed to update explorer post" });
  }
};

const BusinessUpdatePost = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags, location, long, latt, image1, image2, image3, image4, category } = req.body;

  try {
    const post = await Posts.findOne({ where: { idposts: id } });

    if (post && post.business_idbusiness !== null) {
      post.title = title;
      post.description = description;
      post.hashtags = hashtagsToString(hashtags);
      post.location = location;
      post.long = long;
      post.latt = latt;
      post.image1 = image1 || post.image1; 
      post.image2 = image2 || post.image2;
      post.image3 = image3 || post.image3;
      post.image4 = image4 || post.image4;
      post.category = category;

      await post.save();

      res.status(200).json(post);
    } else {
      res.status(404).json({ error: "Post not found or not associated with a business" });
    }
  } catch (error) {
    console.error("Error updating business post:", error);
    res.status(500).json({ error: "Failed to update business post" });
  }
};

const ExplorerDeletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Posts.findOne({ where: { idposts: id } });

    if (post && post.explorer_idexplorer !== null) {
      const explorerId = post.explorer_idexplorer;

      // Delete the post
      await post.destroy();
      
      // Update numOfPosts in Explorer model by decrementing
      await Explorer.decrement('numOfPosts', { where: { idexplorer: explorerId } });

      res.status(200).json({ message: "Explorer post deleted successfully" });
    } else {
      res.status(404).json({ error: "Explorer post not found or not associated with an explorer" });
    }
  } catch (error) {
    console.error("Error deleting explorer post:", error);
    res.status(500).json({ error: "Failed to delete explorer post" });
  }
};
const BusinessDeletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Posts.findOne({ where: { idposts: id } });

    if (post && post.business_idbusiness !== null) {
      await post.destroy();

      // Decrease numOfPosts in Business model
      const business = await db.Business.findByPk(post.business_idbusiness);
      if (business) {
        business.numOfPosts -= 1;
        await business.save();
      }

      res.status(200).json({ message: "Business post deleted successfully" });
    } else {
      res.status(404).json({ error: "Business post not found or not associated with a business" });
    }
  } catch (error) {
    console.error("Error deleting business post:", error);
    res.status(500).json({ error: "Failed to delete business post" });
  }
};


function hashtagsToString(hashtags) {
  return Array.isArray(hashtags) ? hashtags.join(', ') : hashtags;
}

const getAllPosts = async (req, res) => {
  try {
    const posts = await Posts.findAll();
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

const getPostById = async (req, res) => {
  const { idposts } = req.params;

  try {
    const post = await Posts.findByPk(idposts);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

const ratePost = async (req, res) => {
  const { idposts, rating } = req.body;

  try {
    const post = await Posts.findByPk(idposts);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Update total rating and number of ratings
    const newTotalRating = post.totalRating + rating;
    const newNumOfRatings = post.numOfRatings + 1;

    // Calculate average rating
    const averageRating = parseFloat((newTotalRating / newNumOfRatings).toFixed(1));


    // Update post with new ratings data
    post.totalRating = newTotalRating;
    post.numOfRatings = newNumOfRatings;
    post.averageRating = averageRating;

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error("Error rating post:", error);
    res.status(500).json({ error: "Failed to rate post" });
  }
};

const getAllExplorerPosts = async (req, res) => {
  try {
    const explorerPosts = await Posts.findAll({
      where: {
        explorer_idexplorer: { [db.Sequelize.Op.ne]: null } 
      }
    });
    res.status(200).json(explorerPosts);
  } catch (error) {
    console.error("Error fetching explorer posts:", error);
    res.status(500).json({ error: "Failed to fetch explorer posts" });
  }
};
const getAllBusinessPosts = async (req, res) => {
  try {
    const businessPosts = await Posts.findAll({
      where: {
        business_idbusiness: { [db.Sequelize.Op.ne]: null } 
      }
    });
    res.status(200).json(businessPosts);
  } catch (error) {
    console.error("Error fetching business posts:", error);
    res.status(500).json({ error: "Failed to fetch business posts" });
  }
};
const getTopRatedPosts = async (req, res) => {
  try {
    const topRatedPosts = await db.Posts.findAll({
      attributes: [
        'idposts',
        'title',
        'description',
        'hashtags',
        'location',
        'image1',
        'averageRating'
      ],
      order: [[db.Sequelize.literal('averageRating'), 'DESC']],
      limit: 5
    });

    const formattedTopPosts = topRatedPosts.map(post => ({
      idposts: post.idposts,
      title: post.title,
      description: post.description,
      hashtags: post.hashtags,
      location: post.location,
      image1: post.image1,
      averageRating: post.averageRating
    }));

    res.status(200).json(formattedTopPosts);
  } catch (error) {
    console.error("Error fetching top rated posts:", error);
    res.status(500).json({ error: "Failed to fetch top rated posts" });
  }
};
const deletePost = async (req, res) => {
  const { idposts } = req.params;

  try {
    const post = await Posts.findOne({ where: { idposts } });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    await post.destroy();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
};
const getRecommendedPosts = async (req, res) => {
  const { idexplorer } = req.params;

  try {
    // Find the explorer by ID
    const explorer = await Explorer.findByPk(idexplorer);

    if (!explorer) {
      return res.status(404).json({ error: "Explorer not found" });
    }

    // Get the explorer's categories
    const categories = explorer.categories ? explorer.categories.split(',').map(cat => cat.trim()) : [];

    if (categories.length === 0) {
      return res.status(200).json([]);
    }

    // Fetch posts that match the explorer's categories
    const recommendedPosts = await Posts.findAll({
      where: {
        category: {
          [db.Sequelize.Op.in]: categories
        }
      }
    });

    res.status(200).json(recommendedPosts);
  } catch (error) {
    console.error("Error fetching recommended posts:", error);
    res.status(500).json({ error: "Failed to fetch recommended posts" });
  }
};
module.exports = {
  ExplorerCreatePost,
  BusinessCreatePost,
  ExplorerUpdatePost,
  BusinessUpdatePost,
  ExplorerDeletePost,
  BusinessDeletePost,
  getAllPosts,
  getPostById,
  ratePost,
  getAllExplorerPosts,
  getAllBusinessPosts,
  getTopRatedPosts,
  deletePost,
  getRecommendedPosts
};
