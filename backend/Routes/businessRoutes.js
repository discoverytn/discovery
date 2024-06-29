const express = require("express");
const {
  BOEditProfile,
  getBusinessById,
  editBusiness,
  getBusinessPosts
} = require("../Controllers/businessController");
const router = express.Router();


// Route to get business profile by ID
router.get("/:idbusiness", getBusinessById);

// Route to update business profile by ID
router.put("/:idbusiness/edit", editBusiness);

// Route to get posts associated with a business profile
router.get("/:idbusiness/posts", getBusinessPosts);

module.exports = router;
