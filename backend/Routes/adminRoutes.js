

const express = require("express");
const {
  getAllUsers,
  getUserByEmail,
  deleteUser,
} = require("../controllers/adminController");
const { changeUserRole } = require("../controllers/authController");

const router = express.Router();

router.get("/getAll", getAllUsers);
router.get("/getOne/:email", getUserByEmail);
router.delete("/delete/:email", deleteUser);
router.put("/change-role", changeUserRole);

module.exports = router;
