// routes/explorer.js

const express = require("express");
const { getExplorerById, editExplorer, getExplorerPosts, addToFavourites, removeFromFavourites, addOrRemoveFromFavorites,isPostFavoritedByExplorer } = require("../Controllers/ExplorerController");
const router = express.Router();

// Route to get a specific explorer profile by their ID
router.get("/:idexplorer", getExplorerById);

// Route to update a specific explorer profile by their ID
router.put("/:idexplorer/edit", editExplorer);

// Route to get all posts by a specific explorer
router.get("/:idexplorer/posts", getExplorerPosts);

// Route to add a post to an explorer's favourites
router.post("/:idexplorer/favourites", addToFavourites);

// Route to remove a post from an explorer's favourites
router.delete("/:idexplorer/favourites/:idposts", removeFromFavourites);

// Route to add or remove a post from an explorer's favourites based on existence
router.post("/:idexplorer/favourites/:idposts/addOrRemove", addOrRemoveFromFavorites); 
router.get("/:idexplorer/favourites/:idposts/check",isPostFavoritedByExplorer)

module.exports = router;
