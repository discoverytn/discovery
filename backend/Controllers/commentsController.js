const db = require('../database/index');
const Comments = db.Comments;
const Explorer = db.Explorer;
const Business = db.Business;
const Post = db.Posts;
const Notif = db.Notif;

const createComment = async (req, res) => {
  const { idposts, content, explorer_idexplorer, business_idbusiness } = req.body;

  try {
    const comment = await Comments.create({
      posts_idposts: idposts,
      content,
      explorer_idexplorer,
      business_idbusiness
    });

    // Fetch the post to get the post owner's ID
    const post = await Post.findByPk(idposts);
    
    // Determine the commenter's name
    let commenterName = '';
    if (explorer_idexplorer) {
      const explorer = await Explorer.findByPk(explorer_idexplorer);
      commenterName = explorer.username;
    } else if (business_idbusiness) {
      const business = await Business.findByPk(business_idbusiness);
      commenterName = business.businessname;
    }

    // Create a notification for the post owner
    await Notif.create({
      type: 'comment',
      message: `${commenterName} commented on your post: "${post.title}"`,
      explorer_idexplorer: post.explorer_idexplorer,
      business_idbusiness: post.business_idbusiness,
      created_at: new Date(),
      is_read: false
    });

    res.status(201).json({
      message: 'Comment created successfully',
      comment
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};


const getCommentsForPost = async (req, res) => {
  const { idposts } = req.params;

  try {
    const comments = await Comments.findAll({
      where: { posts_idposts: idposts },
      include: [
        { 
          model: Explorer, 
          attributes: ['idexplorer', 'username', 'image', 'firstname', 'lastname'] 
        },
        { 
          model: Business, 
          attributes: ['idbusiness', 'businessname', 'image'] 
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  const { idcomments } = req.params;
  const { content } = req.body;

  try {
    const [updated] = await Comments.update({ content }, {
      where: { idcomments: idcomments }
    });

    if (updated) {
      const updatedComment = await Comments.findByPk(idcomments);
      res.status(200).json(updatedComment);
    } else {
      res.status(404).json({ error: 'Comment not found' });
    }
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { idcomments } = req.params;

  try {
    const deleted = await Comments.destroy({
      where: { idcomments: idcomments }
    });

    if (deleted) {
      res.status(204).json({ message: 'Comment deleted successfully' });
    } else {
      res.status(404).json({ error: 'Comment not found' });
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

const getUserComments = async (req, res) => {
    const { userId } = req.params;
    const { userType } = req.query; 
  
    try {
      let where = {};
      if (userType === 'explorer') {
        where.explorer_idexplorer = userId;
      } else if (userType === 'business') {
        where.business_idbusiness = userId;
      } else {
        return res.status(400).json({ error: 'Invalid user type' });
      }
  
      const comments = await Comments.findAll({
        where,
        include: [
          { model: Post, attributes: ['idposts', 'title'] },
          userType === 'explorer' 
            ? { model: Explorer, attributes: ['idexplorer', 'username'] }
            : { model: Business, attributes: ['idbusiness', 'businessname'] }
        ],
        order: [['createdAt', 'DESC']]
      });
  
      res.status(200).json(comments);
    } catch (error) {
      console.error('Error fetching user comments:', error);
      res.status(500).json({ error: 'Failed to fetch user comments' });
    }
  };

module.exports = {
  createComment,
  getCommentsForPost,
  updateComment,
  deleteComment,
  getUserComments
};