const express = require("express");
const {
  BOEditProfile,
  getBusinessById,
  editBusiness,
  getBusinessPosts,
  getBusinessNumberPosts,
  getPendingBusinesses
} = require("../Controllers/businessController");
const router = express.Router();


// get all pending

router.get("/pending", getPendingBusinesses);

// route to get business profile by ID
router.get("/:idbusiness", getBusinessById);
// route to update business profile by ID
router.put("/:idbusiness/edit", editBusiness);

// route to get posts associated with a business profile
router.get("/:idbusiness/posts", getBusinessPosts);
router.get("/:idbusiness/numposts", getBusinessNumberPosts);

module.exports = router;
