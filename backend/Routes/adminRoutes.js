const express = require("express");
const {
  getAllUsers,
  getUserByEmail,
  deleteUser,
  getAllBO,
  getAllExplorers,
  getBusinessById,
  deleteExplorer,
  deleteBusinessOwner
} = require("../Controllers/adminController");
const { changeUserRole } = require("../Controllers/authController")

const router = express.Router();

router.get("/getAll", getAllUsers);
router.get('/business', getAllBO);
router.get('/explorer', getAllExplorers);
router.get("/getOne/:email", getUserByEmail);
router.delete("/delete/explorer/:explorerId", deleteExplorer);
router.delete("/delete/business/:ownerId", deleteBusinessOwner);
router.delete("/delete/:email", deleteUser);
router.put("/change-role", changeUserRole);
router.get('/business/:businessId', getBusinessById);

module.exports = router;
