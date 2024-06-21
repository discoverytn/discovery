

const express = require("express");
const {
  getAllUsers,
  getUserByEmail,
  deleteUser,
} = require("../Controllers/adminController");
const { changeUserRole } = require("../Controllers/authController");
const {getAllBO,getAllExplorers} = require('../Controllers/adminController');

const router = express.Router();

router.get("/getAll", getAllUsers);
router.get('/business', getAllBO);
router.get('/explorer', getAllExplorers);
router.get("/getOne/:email", getUserByEmail);
router.delete("/delete/:email", deleteUser);
router.put("/change-role", changeUserRole);

module.exports = router;
