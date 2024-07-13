const db = require("../database/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendResetCodeEmail, generateResetCode } = require("../resetCode");

const uniqueChecker = async (username, email) => {
  const explorer = await db.Explorer.findOne({ where: { username } });
  const business = await db.Business.findOne({ where: { username } });
  const admin = await db.Admin.findOne({ where: { username } });

  const userByEmail =
    (await db.Explorer.findOne({ where: { email } })) ||
    (await db.Business.findOne({ where: { email } })) ||
    (await db.Admin.findOne({ where: { email } }));

  return !explorer && !business && !admin && !userByEmail;
};

const registerExplorer = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const isUnique = await uniqueChecker(username, email);
    if (!isUnique) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newExplorer = await db.Explorer.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newExplorer.idexplorer, email: newExplorer.email, role: "explorer" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error("Register explorer error:", error);
    res.status(500).json({ error: error.message });
  }
};

const registerBO = async (req, res) => {
  const { email, username, password, businessName, BOid, credImg, category } = req.body; 
  try {
    const isUnique = await uniqueChecker(username, email);
    if (!isUnique) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    
    const newBusiness = await db.Business.create({
      email,
      username,
      password: hashedPassword,
      businessName,
      BOid,
      credImg,
      category,
      approvalStatus: 'pending', 
    });

    const token = jwt.sign(
      { id: newBusiness.idbusiness, email: newBusiness.email, role: "business", category: newBusiness.category },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error("Register business owner error:", error);
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
      if (user && user.approvalStatus !== 'accepted') {
        return res.status(401).json({ error: "Your request has been sent, please wait for admin approval" });
      }
    }

    if (!user) {
      user = await db.Admin.findOne({ where: { email } });
    }

    if (!user) {
      return res.status(402).json({ error: "Please re-check your info" });
    }

    const pwChecker = await bcrypt.compare(password, user.password);
    if (!pwChecker) {
      return res.status(403).json({ error: "Wrong password" });
    }

    let role;
    let id;
    let categories = null; // Initialize categories variable
    let subscribed;
    if (user instanceof db.Admin) {
      role = "admin";
      id = user.idadmin;
    } else if (user instanceof db.Explorer) {
      role = "explorer";
      id = user.idexplorer;
      categories = user.categories; // Assign categories from user object
    } else if (user instanceof db.Business) {
      role = "business";
      id = user.idbusiness;
      subscribed = user.subscribed
    } else {
      return res.status(500).json({ error: "Unknown user type" });
    }

    const tokenPayload = { id, email: user.email, role, categories,subscribed };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
};




const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    let user = await db.Explorer.findOne({ where: { email } });
    if (!user) {
      user = await db.Business.findOne({ where: { email } });
    }
    if (!user) {
      user = await db.Admin.findOne({ where: { email } });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(newPassword, user.password);
    if (isMatch) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
};

const changeUserRole = async (req, res) => {
  const { email, newRole } = req.body;
  try {
    let user = await db.Explorer.findOne({ where: { email } });
    if (user) {
      await user.update({ role: newRole });
      return res
        .status(200)
        .json({ message: "User role updated successfully" });
    }

    user = await db.Business.findOne({ where: { email } });
    if (user) {
      await user.update({ role: newRole });
      return res
        .status(200)
        .json({ message: "User role updated successfully" });
    }

    res.status(404).json({ error: "User not found" });
  } catch (error) {
    console.error("Change user role error:", error);
    res.status(500).json({ error: error.message });
  }
};

const sendResetCode = async (req, res) => {
  const { email } = req.body;

  try {
    const resetCode = generateResetCode();

    await sendResetCodeEmail(email, resetCode);

    let user = await db.Explorer.findOne({ where: { email } });
    if (!user) {
      user = await db.Business.findOne({ where: { email } });
    }
    if (!user) {
      user = await db.Admin.findOne({ where: { email } });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.resetCode = resetCode;
    await user.save();

    res.status(200).json({ message: "Reset code sent successfully" });
  } catch (error) {
    console.error("Send reset code error:", error);
    res.status(500).json({ error: "Failed to send reset code" });
  }
};

const verifyResetCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    let user;

    user = await db.Explorer.findOne({ where: { email } });
    if (!user) {
      user = await db.Business.findOne({ where: { email } });
    }
    if (!user) {
      user = await db.Admin.findOne({ where: { email } });
    }

    if (!user || code !== user.resetCode) {
      return res.status(400).json({ error: "Invalid reset code" });
    }

    res.status(200).json({ message: "Code verified successfully" });
  } catch (error) {
    console.error("Verify reset code error:", error);
    res.status(500).json({ error: "Failed to verify reset code" });
  }
};

module.exports = {
  registerExplorer,
  registerBO,
  login,
  resetPassword,
  changeUserRole,
  sendResetCode,
  verifyResetCode,
};