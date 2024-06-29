const express = require("express");
const { getExplorerById, editExplorer, getExplorerPosts } = require("../Controllers/ExplorerController");
const router = express.Router();

// Route to get a specific explorer profile by their ID
router.get("/:idexplorer", getExplorerById);

// Route to update a specific explorer profile by their ID
router.put("/:idexplorer/edit", editExplorer);

// Route to get all posts by a specific explorer
router.get("/:idexplorer/posts", getExplorerPosts);

module.exports = router;
