// controllers/adminController.js

const db = require("../database/index");

const getAllUsers = async (req, res) => {
  try {
    const admins = await db.Admin.findAll();
    const explorers = await db.Explorer.findAll();
    const businesses = await db.Business.findAll();
    // Handle response
    res.status(200).json({ admins, explorers, businesses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    let user = await db.Explorer.findOne({ where: { email } });
    if (!user) {
      user = await db.Business.findOne({ where: { email } });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const role = user instanceof db.Explorer ? "explorer" : "business";
    res.status(200).json({ user, role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { email } = req.params;
  try {
    let user = await db.Explorer.findOne({ where: { email } });
    if (!user) {
      user = await db.Business.findOne({ where: { email } });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
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
          username: user.username,
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
          latt: user.latt,
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
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          password: user.password,
          description: user.description,
          image: user.image,
          badge: user.badge,
          numOfPosts: user.numOfPosts,
          numOfVisits: user.numOfVisits,
          mobileNum: user.mobileNum,
          numOfReviews: user.numOfReviews,
          coins: user.coins,
          long: user.long,
          latt: user.latt,
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

module.exports = { getAllUsers, getUserByEmail, deleteUser, editUserRole };
