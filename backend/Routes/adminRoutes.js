

const express = require("express");
const {
  getAllUsers,
  getUserByEmail,
  deleteUser,
} = require("../Controllers/adminController");
const { changeUserRole } = require("../Controllers/authController");

const router = express.Router();

router.get("/getAll", getAllUsers);
router.get("/getOne/:email", getUserByEmail);
router.delete("/delete/:email", deleteUser);
router.put("/change-role", changeUserRole);

module.exports = router;
