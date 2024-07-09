const db = require('../database/index');
const { approveEmail,declineEmail } = require('../approveEmail'); 

const getAllUsers = async (req, res) => {
  try {
    const explorers = await db.Explorer.findAll();
    const businesses = await db.Business.findAll();
    res.json({ explorers, businesses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    let user = await db.Admin.findOne({ where: { email } });
    if (!user) {
      user = await db.Explorer.findOne({ where: { email } });
    }
    if (!user) {
      user = await db.Business.findOne({ where: { email } });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { email } = req.params;
  try {
    let user = await db.Admin.findOne({ where: { email } });
    if (user) {
      await user.destroy();
      return res.json({ message: 'User deleted' });
    }
    user = await db.Explorer.findOne({ where: { email } });
    if (user) {
      await user.destroy();
      return res.json({ message: 'User deleted' });
    }
    user = await db.Business.findOne({ where: { email } });
    if (user) {
      await user.destroy();
      return res.json({ message: 'User deleted' });
    }
    res.status(404).json({ error: 'User not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const editUserRole = async (req, res) => {
  const { email, currentRole, newRole } = req.body;
  try {
    let user;

    if (newRole === "business") {
      user = await db.Explorer.findOne({ where: { email } });
      if (user) {
        await db.Business.create({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          password: user.password,
          description: user.description,
          image: user.image,
          badge: user.badge,
          numOfPosts: user.numOfPosts,
          mobileNum: user.mobileNum,
          numOfReviews: user.numOfReviews,
          businessName: user.businessName,
          businessDesc: user.businessDesc,
          businessImg: user.businessImg,
          long: user.long,
          latt: user.latt
        });
        await user.destroy();
        console.log("User has been changed from explorer to business owner successfully");
      } else {
        console.log("User not found in explorer table");
      }
    } else if (newRole === "explorer") {
      user = await db.Business.findOne({ where: { email } });
      if (user) {
        await db.Explorer.create({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          password: user.password,
          description: user.description,
          image: user.image,
          badge: user.badge,
          numOfPosts: user.numOfPosts,
          numOfVisits: user.numOfVisits,
          coins: user.coins,
          mobileNum: user.mobileNum,
          numOfReviews: user.numOfReviews,
          long: user.long,
          latt: user.latt
        });
        await user.destroy();
        console.log("User has been changed from business owner to explorer successfully");
      } else {
        console.log("User not found in business table");
      }
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "Role updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getAllBO = async (req, res) => {
  try {
    const businessOwners = await db.Business.findAll();
    res.json(businessOwners);
  } catch (error) {
    console.error("Find all business owners error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllExplorers = async (req, res) => {
  try {
    const explorers = await db.Explorer.findAll();
    res.json(explorers);
  } catch (error) {
    console.error("Find all explorers error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getBusinessById = async (req, res) => {
  const { businessId } = req.params;

  try {
    const business = await db.Business.findByPk(businessId);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    res.json(business);
  } catch (error) {
    console.error('Error fetching business by ID:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteExplorer = async (req, res) => {
  const { explorerId } = req.params;

  try {
    const explorer = await db.Explorer.findByPk(explorerId);

    if (!explorer) {
      return res.status(404).json({ error: 'Explorer not found' });
    }

    const comments = await db.Comments.findAll({
      where: {
        explorer_idexplorer: explorerId,
      }
    });

    await Promise.all(comments.map(comment => comment.destroy()));

    const posts = await db.Posts.findAll({
      where: {
        explorer_idexplorer: explorerId,
      }
    });

    await Promise.all(posts.map(post => post.destroy()));

    const comments = await db.Comments.findAll({
      where: {
        explorer_idexplorer: explorerId,
      }
    });

    await Promise.all(comments.map(comment => comment.destroy()));

    await explorer.destroy();

    res.json({ message: 'Explorer, associated comments, and posts deleted successfully' });

    res.json({ message: 'Explorer and associated comments deleted successfully' });
  } catch (error) {
    console.error('Error deleting explorer, comments, and posts:', error);
    console.error('Error deleting explorer and comments:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteBusinessOwner = async (req, res) => {
  const { ownerId } = req.params;

  try {
    const businessOwner = await db.Business.findByPk(ownerId);

    if (!businessOwner) {
      return res.status(404).json({ error: 'Business owner not found' });
    }

    const comments = await db.Comments.findAll({
      where: {
        business_idbusiness: ownerId,
      }
    });

    await Promise.all(comments.map(comment => comment.destroy()));

    const posts = await db.Posts.findAll({
      where: {
        business_idbusiness: ownerId,
      }
    });

    await Promise.all(posts.map(post => post.destroy()));

    const comments = await db.Comments.findAll({
      where: {
        business_idbusiness: ownerId,
      }
    });

    await Promise.all(comments.map(comment => comment.destroy()));

    await businessOwner.destroy();

    res.json({ message: 'Business owner, associated comments, and posts deleted successfully' });

    res.json({ message: 'Business owner and associated comments deleted successfully' });
  } catch (error) {
    console.error('Error deleting business owner, comments, and posts:', error);
    console.error('Error deleting business owner and comments:', error);
    res.status(500).json({ error: error.message });
  }
};

const approveBusiness = async (req, res) => {
  try {
    const business = await db.Business.findByPk(req.params.idbusiness);
    if (!business) {
      return res.status(404).send("Business not found");
    }

    business.approvalStatus = 'accepted';
    await business.save();

    
    const recipientEmail = business.email;
    await approveEmail(recipientEmail);

    return res.status(200).send("Business approved successfully");
  } catch (error) {
    console.error("Error approving business:", error);
    return res.status(500).send("Failed to approve business");
  }
};

const declineBusiness = async (req, res) => {
  try {
    const business = await db.Business.findByPk(req.params.idbusiness);
    if (!business) {
      return res.status(404).send("Business not found");
    }

    
    const recipientEmail = business.email;
    await declineEmail(recipientEmail);

    await business.destroy();

    return res.status(200).send("Business declined and deleted successfully");
  } catch (error) {
    console.error("Error declining business:", error);
    return res.status(500).send("Failed to decline business");
  }
};

module.exports = {
  getAllUsers,
  getUserByEmail,
  deleteUser,
  editUserRole,
  getAllBO,
  getAllExplorers,
  getBusinessById,
  deleteExplorer,
  deleteBusinessOwner,
  approveBusiness,
  declineBusiness,
};
