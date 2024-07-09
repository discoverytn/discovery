const db = require('../database/index');

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

module.exports = {
  getAllUsers,
  getUserByEmail,
  deleteUser,
  editUserRole,
  getAllBO,
  getAllExplorers,
  getBusinessById
};
