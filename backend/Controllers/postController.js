const db = require('../database/index');
const Posts = db.Posts;

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

    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating explorer post:", error);
    res.status(500).json({ error: "Failed to create explorer post" });
  }
};

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
      await post.destroy();
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

module.exports = {
  ExplorerCreatePost,
  BusinessCreatePost,
  ExplorerUpdatePost,
  BusinessUpdatePost,
  ExplorerDeletePost,
  BusinessDeletePost,
};
