const db = require('../database/index');


const getAllUsers = async (req, res) => {
  try {
    const explorers = await db.Explorer.findAll();
    const businesses = await db.Business.findAll();

    res.json({explorers,businesses});
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

// Delete user by email
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

// Edit user role
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
        console.log("user has been changed from explorer to business owner successfully");
      } else {

        console.log("user not found in explorer table");
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
        console.log("user has been changed from business owner to explorer successfully");
      } else {
        console.log("user not found in business table");
      }
    }
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    res.status(200).json({ message: "role updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

const getAllBO = (req, res) => {
  db.Business.findAll()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.error("find all business owners error:", error);
      res.status(500).send(error);
    });
};

const getAllExplorers = (req, res) => {
  db.Explorer.findAll()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.error("find all explorers error:", error);
      res.status(500).send(error);
    });
};

module.exports = {
  getAllUsers,
  getUserByEmail,
  deleteUser,
  editUserRole,
  getAllBO,
  getAllExplorers
};
