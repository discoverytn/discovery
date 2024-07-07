const bcrypt = require("bcrypt");
const db = require("../database/index");

module.exports = {
  getExplorerById: async function (req, res) {
    try {
      const explorer = await db.Explorer.findByPk(req.params.idexplorer);
      if (!explorer) {
        return res.status(404).send("Explorer not found");
      }
      return res.status(200).json(explorer);
    } catch (error) {
      console.error("Error fetching explorer:", error);
      return res.status(500).send("Failed to fetch explorer");
    }
  },

  editExplorer: async function (req, res) {
    try {
      const explorer = await db.Explorer.findByPk(req.params.idexplorer);
      if (!explorer) {
        return res.status(404).send("Explorer not found");
      }

      if (!req.body.currentPassword) {
        return res.status(400).send("Current password is required");
      }

      const isPasswordValid = await bcrypt.compare(
        req.body.currentPassword,
        explorer.password
      );
      if (!isPasswordValid) {
        return res.status(401).send("Invalid password");
      }

      const updateFields = {
        firstname: req.body.firstname || explorer.firstname,
        lastname: req.body.lastname || explorer.lastname,
        description: req.body.description || explorer.description,
        image: req.body.image || explorer.image,
        mobileNum: req.body.mobileNum || explorer.mobileNum,
        governorate: req.body.governorate || explorer.governorate,
        municipality: req.body.municipality || explorer.municipality,
      };

      if (req.body.newPassword) {
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        updateFields.password = hashedPassword;
      }

      const result = await db.Explorer.update(updateFields, {
        where: { idexplorer: req.params.idexplorer },
      });

      if (result[0] === 1) {
        const newData = await db.Explorer.findOne({
          where: { idexplorer: req.params.idexplorer },
        });
        return res.status(200).send(newData);
      } else {
        return res.status(500).send("Failed to update explorer");
      }
    } catch (error) {
      console.error("Error updating explorer:", error);
      return res.status(500).send("Failed to update explorer");
    }
  },

  getExplorerPosts: async function (req, res) {
    const { idexplorer } = req.params;

    try {
      const explorer = await db.Explorer.findByPk(idexplorer);
      if (!explorer) {
        return res.status(404).json({ error: "Explorer not found" });
      }

      const posts = await db.Posts.findAll({
        where: { explorer_idexplorer: idexplorer },
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json(posts);
    } catch (error) {
      console.error("Error fetching explorer posts:", error);
      return res.status(500).json({ error: "Failed to fetch explorer posts" });
    }
  },
  getExplorerNumberPosts: async function (req, res) {
    const { idexplorer } = req.params;

    try {
      const explorer = await db.Explorer.findByPk(idexplorer);
      if (!explorer) {
        return res.status(404).json({ error: "Explorer not found" });
      }

      const posts = await db.Posts.findAll({
        where: { explorer_idexplorer: idexplorer },
        order: [["createdAt", "DESC"]],
      });
      const numOfPosts=posts.length
      await explorer.update({numOfPosts:numOfPosts})
      return res.status(200).json(numOfPosts);
    } catch (error) {
      console.error("Error fetching number explorer posts:", error);
      return res.status(500).json({ error: "Failed to fetch explorer posts" });
    }
  },
  removeFromFavourites: async function (req, res) {
    const { idexplorer, idposts } = req.params;

    try {
      const favorite = await db.Favorites.findOne({
        where: {
          explorer_idexplorer: idexplorer,
          posts_idposts: idposts,
        },
      });

      if (!favorite) {
        return res.status(404).json({ error: "Favorite record not found" });
      }

      await favorite.destroy();

      return res.status(200).json({ message: "Post removed from favourites" });
    } catch (error) {
      console.error("Error removing post from favourites:", error);
      return res
        .status(500)
        .json({ error: "Failed to remove post from favourites" });
    }
  },

  addOrRemoveFromFavorites: async function (req, res) {
    const { idexplorer, idposts } = req.params;

  try {
    const favorite = await db.Favorites.findOne({
      where: {
        explorer_idexplorer: idexplorer,
        posts_idposts: idposts,
      },
    });

    if (favorite) {
      await favorite.destroy();
      return res.status(200).json({ message: "Post removed from favorites" });
    } else {
      const post = await db.Posts.findByPk(idposts);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      await db.Favorites.create({
        explorer_idexplorer: idexplorer,
        posts_idposts: idposts,
        post_title: post.title,         
        post_image1: post.image1,
        post_location: post.location,
      });

      // Create a notification for the post owner
      const explorer = await db.Explorer.findByPk(idexplorer);
      await db.Notif.create({
        type: 'favorite',
        message: `${explorer.firstname} ${explorer.lastname} added your post to favorites`,
        explorer_idexplorer: post.explorer_idexplorer,
        business_idbusiness: null,
        created_at: new Date(),
        is_read: false
      });

      return res.status(200).json({ message: "Post added to favorites" });
    }
  } catch (error) {
    console.error("Error adding/removing post to/from favorites:", error);
    return res
      .status(500)
      .json({ error: "Failed to add/remove post to/from favorites" });
  }
  },
  
  
  isPostFavoritedByExplorer: async function (req, res) {
    const { idexplorer, idposts } = req.params;

    try {
      const favorite = await db.Favorites.findOne({
        where: { explorer_idexplorer: idexplorer, posts_idposts: idposts },
      });

      if (favorite) {
        return res.status(200).json({ favorited: true });
      } else {
        return res.status(200).json({ favorited: false });
      }
    } catch (error) {
      return res.status(500).json({ error: "Error checking favorite" });
    }
  },

  getExplorerFavorites: async function (req, res) {
    const { idexplorer } = req.params;
  
    try {
      const favoritePosts = await db.Favorites.findAll({
        where: { explorer_idexplorer: idexplorer },
        include: [
          {
            model: db.Posts,
            attributes: ['idposts', 'title', 'image1', 'location'],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.status(200).json(favoritePosts);
    } catch (error) {
      console.error("Error fetching explorer favorites:", error);
      return res.status(500).json({ error: "Failed to fetch explorer favorites" });
    }
  },
  addOrRemoveFromTraveled: async function (req, res) {
    const { idexplorer, idposts } = req.params;
  
    try {
      const traveled = await db.Traveled.findOne({
        where: {
          explorer_idexplorer: idexplorer,
          posts_idposts: idposts,
        },
      });
  
      if (traveled) {
        await traveled.destroy();
        return res.status(200).json({ message: "Post removed from traveled" });
      } else {
        const post = await db.Posts.findByPk(idposts);
        if (!post) {
          return res.status(404).json({ error: "Post not found" });
        }
  
        await db.Traveled.create({
          explorer_idexplorer: idexplorer,
          posts_idposts: idposts,
          post_title: post.title,         
          post_image1: post.image1,
          post_location: post.location,
        });
  
        return res.status(200).json({ message: "Post added to traveled" });
      }
    } catch (error) {
      console.error("Error adding/removing post to/from traveled:", error);
      return res
        .status(500)
        .json({ error: "Failed to add/remove post to/from traveled" });
    }
  },
  removeFromTraveled: async function (req, res) {
    const { idexplorer, idposts } = req.params;

    try {
      const traveled = await db.Traveled.findOne({
        where: {
          explorer_idexplorer: idexplorer,
          posts_idposts: idposts,
        },
      });

      if (!traveled) {
        return res.status(404).json({ error: "Traveled record not found" });
      }

      await traveled.destroy();

      return res.status(200).json({ message: "Post removed from traveled" });
    } catch (error) {
      console.error("Error removing post from traveled:", error);
      return res
        .status(500)
        .json({ error: "Failed to remove post from traveled" });
    }
  },
  isPostTraveledByExplorer: async function (req, res) {
    const { idexplorer, idposts } = req.params;

    try {
      const traveled = await db.Traveled.findOne({
        where: { explorer_idexplorer: idexplorer, posts_idposts: idposts },
      });

      if (traveled) {
        return res.status(200).json({ traveled: true });
      } else {
        return res.status(200).json({ traveled: false });
      }
    } catch (error) {
      return res.status(500).json({ error: "Error checking traveled" });
    }
  }
  
  
  
};
