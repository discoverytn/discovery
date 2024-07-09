const express = require("express");
const {
  BOEditProfile
} = require("../Controllers/businessController");
const router = express.Router();

router.post("/edit", BOEditProfile);


module.exports = router;
