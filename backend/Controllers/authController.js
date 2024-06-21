

const db = require("../database/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { editUserRole } = require("./adminController");

const registerExplorer = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newExplorer = await db.Explorer.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json(newExplorer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const registerBO = async (req, res) => {
  const { email, username, password, businessName, BOid, credImg } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newBusiness = await db.Business.create({
      email,
      username,
      password: hashedPassword,
      businessName,
      BOid,
      credImg,
    });
    res.status(201).json(newBusiness);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ error: "Please insert your email" });
    }
    let user = await db.Explorer.findOne({ where: { email } });
    if (!user) {
      user = await db.Business.findOne({ where: { email } });
    }
    if (!user) {
      user = await db.Admin.findOne({ where: { email } });
    }
    if (!user) {
      return res.status(401).json({ error: "Please re-check your info" });
    }
    const pwChecker = await bcrypt.compare(password, user.password);
    if (!pwChecker) {
      return res.status(401).json({ error: "Wrong password" });
    }
    let role;
    if (user instanceof db.Admin) {
      role = "admin";
    } else if (user instanceof db.Explorer) {
      role = "explorer";
    } else if (user instanceof db.Business) {
      role = "business";
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role },
      process.env.JWT_SECRET
    );
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const changeUserRole = async (req, res) => {
  const { email, newRole } = req.body;
  try {
    let user = await db.Explorer.findOne({ where: { email } });
    if (user) {
      return await editUserRole(
        { body: { email, currentRole: "explorer", newRole } },
        res
      );
    }
    user = await db.Business.findOne({ where: { email } });
    if (user) {
      return await editUserRole(
        { body: { email, currentRole: "business", newRole } },
        res
      );
    }
    res.status(404).json({ error: "User not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerExplorer, registerBO, login, changeUserRole };
