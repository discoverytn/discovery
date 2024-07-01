const bcrypt = require('bcrypt');
const db = require('../database/index'); 

module.exports = {
  getExplorerById: async function(req, res) {
    try {
      const explorer = await db.Explorer.findByPk(req.params.idexplorer);
      if (!explorer) {
        return res.status(404).send("Explorer not found");
      }
      return res.status(200).json(explorer);
    } catch (error) {
      console.error("Error fetching explorer:", error);
      return res.status(500).send("Failed to fetch explorer");
    }
  },

  editExplorer: async function(req, res) {
    try {
      const explorer = await db.Explorer.findByPk(req.params.idexplorer);
      if (!explorer) {
        return res.status(404).send("Explorer not found");
      }

      if (!req.body.currentPassword) {
        return res.status(400).send("Current password is required");
      }

      const isPasswordValid = await bcrypt.compare(req.body.currentPassword, explorer.password);
      if (!isPasswordValid) {
        return res.status(401).send("Invalid password");
      }

      const updateFields = {
        firstname: req.body.firstname || explorer.firstname,
        lastname: req.body.lastname || explorer.lastname,
        description: req.body.description || explorer.description,
        image: req.body.image || explorer.image,
        mobileNum: req.body.mobileNum || explorer.mobileNum,
        governorate: req.body.governorate || explorer.governorate,
        municipality: req.body.municipality || explorer.municipality,
      };

      
      if (req.body.newPassword) {
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        updateFields.password = hashedPassword;
      }

      
      const result = await db.Explorer.update(updateFields, {
        where: { idexplorer: req.params.idexplorer }
      });

      if (result[0] === 1) {
        console.log("aaa",result)
        const newData = await db.Explorer.findOne({where : {idexplorer : req.params.idexplorer}})
        return res.status(200).send(newData);
      
      } else {
        return res.status(500).send("Failed to update explorer");
      }
    } catch (error) {
      console.error("Error updating explorer:", error);
      return res.status(500).send("Failed to update explorer");
    }
  },

  
  getExplorerPosts: async function(req, res) {
    const { idexplorer } = req.params;

    try {
      const explorer = await db.Explorer.findByPk(idexplorer);
      if (!explorer) {
        return res.status(404).json({ error: "Explorer not found" });
      }

      const posts = await db.Posts.findAll({
        where: { explorer_idexplorer: idexplorer },
        order: [['createdAt', 'DESC']], 
      });

      return res.status(200).json(posts);
    } catch (error) {
      console.error("Error fetching explorer posts:", error);
      return res.status(500).json({ error: "Failed to fetch explorer posts" });
    }
  },
};
