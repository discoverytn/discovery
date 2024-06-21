const db = require('../database/index');

// Get all users (Admin, Explorer, Business)
const getAllUsers = async (req, res) => {
  try {
    const admins = await db.Admin.findAll();
    const explorers = await db.Explorer.findAll();
    const businesses = await db.Business.findAll();

    res.json({ admins, explorers, businesses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get user by email
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
    switch (currentRole) {
      case 'admin':
        user = await db.Admin.findOne({ where: { email } });
        break;
      case 'explorer':
        user = await db.Explorer.findOne({ where: { email } });
        break;
      case 'business':
        user = await db.Business.findOne({ where: { email } });
        break;
      default:
        return res.status(400).json({ error: 'Invalid role' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    switch (newRole) {
      case 'admin':
        await db.Admin.create(user.get());
        break;
      case 'explorer':
        await db.Explorer.create(user.get());
        break;
      case 'business':
        await db.Business.create(user.get());
        break;
      default:
        return res.status(400).json({ error: 'Invalid role' });
    }

    await user.destroy();
    res.json({ message: 'User role updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserByEmail,
  deleteUser,
  editUserRole
};
