const express = require("express");
const router = express.Router();
const {
  registerExplorer,
  registerBO,
  login,
  resetPassword,
  sendResetCode, 
  changeUserRole,
  verifyResetCode 
} = require("../Controllers/authController");
// endpoint to register an explorer
router.post("/register/explorer", registerExplorer);

// endpoint to register a business owner
router.post("/register/business", registerBO);
// endpoint to verify reset code
router.post("/verify-code", verifyResetCode);

// endpoint for login
router.post("/login", login);

// endpoint for resetting password
router.post("/reset-password", resetPassword);

// endpoint to send reset code 
router.post("/send-reset-code", sendResetCode);

// endpoint for changing user role
router.put("/change-role", changeUserRole);



module.exports = router;
