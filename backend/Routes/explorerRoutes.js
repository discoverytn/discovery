const express = require("express");
const { getExplorerById, editExplorer, getExplorerPosts,getExplorerNumberPosts, removeFromFavourites, addOrRemoveFromFavorites, isPostFavoritedByExplorer, getExplorerFavorites,addOrRemoveFromTraveled,removeFromTraveled,isPostTraveledByExplorer } = require("../Controllers/ExplorerController");
const router = express.Router();

// Route to get a specific explorer profile by their ID
router.get("/:idexplorer", getExplorerById);

// Route to update a specific explorer profile by their ID
router.put("/:idexplorer/edit", editExplorer);

// Route to get all posts by a specific explorer
router.get("/:idexplorer/posts", getExplorerPosts);

router.get("/:idexplorer/numPosts", getExplorerNumberPosts);



// Route to remove a post from an explorer's favourites
router.delete("/:idexplorer/favourites/:idposts", removeFromFavourites);

// Route to add or remove a post from an explorer's favourites based on existence
router.post("/:idexplorer/favourites/:idposts/addOrRemove", addOrRemoveFromFavorites);

// Route to check if a post is favorited by an explorer
router.get("/:idexplorer/favourites/:idposts/check", isPostFavoritedByExplorer);

// Route to get all favorite posts of an explorer
router.get("/:idexplorer/favourites", getExplorerFavorites);

// Route to add or remove a post from an explorer's traveled based on existence
router.post("/:idexplorer/traveled/:idposts/addOrRemove", addOrRemoveFromTraveled);

// Route to remove a post from an explorer's traveled
router.delete("/:idexplorer/traveled/:idposts", removeFromTraveled);

// Route to check if a post is favorited by an explorer
router.get("/:idexplorer/traveled/:idposts/check", isPostTraveledByExplorer);


module.exports = router;
