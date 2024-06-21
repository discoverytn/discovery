const express = require("express");
const {
  editExplorer
} = require("../Controllers/explorerController");
const router = express.Router();

router.post("/edit", editExplorer);


module.exports = router;