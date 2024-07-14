const bcrypt = require('bcrypt');
const db = require('../database/index'); 
const Business = db.Business;
const Posts = db.Posts;

module.exports = {
  getBusinessById: async function(req, res) {
    try {
      const business = await db.Business.findByPk(req.params.idbusiness, {
        include: [{ model: db.Posts, as: 'Posts' }]
      });
      if (!business) {
        return res.status(404).send("Business not found");
      }
      return res.status(200).json(business);
    } catch (error) {
      console.error("Error fetching business:", error);
      return res.status(500).send("Failed to fetch business");
    }
  },
  getTopBusinessesByPostCount: async function (req, res) {
    try {
      console.log("Attempting to fetch top businesess by post count");
      
      const topBusinesess = await db.Business.findAll({
        attributes: ['idbusiness', 'firstname', 'image', 'numOfPosts'],
        order: [['numOfPosts', 'DESC']],
        limit: 3
      });
  
      console.log("Query executed successfully");
      console.log("Top businesses:", JSON.stringify(topBusinesess, null, 2));
  
      if (topBusinesess.length === 0) {
        console.log("No businesess found");
        return res.status(404).json({ error: "No businesess found" });
      }
  
      // Format the result
      const formattedtopBusinesess = topBusinesess.map(business => ({
        idbusiness: business.idbusiness,
        firstname: business.firstname,
        image: business.image,
        postCount: business.numOfPosts
      }));
  
      return res.status(200).json(formattedtopBusinesess);
    } catch (error) {
      console.error("Error fetching top businesess by posts:", error);
      console.error("Error stack:", error.stack);
      return res.status(500).json({ error: "Failed to fetch top businesess", details: error.message });
    }
  },

  editBusiness: async function(req, res) {
    try {
      const business = await db.Business.findByPk(req.params.idbusiness);
      if (!business) {
        return res.status(404).send("Business not found");
      }

      if (!req.body.currentPassword) {
        return res.status(400).send("Current password is required");
      }

      const isPasswordValid = await bcrypt.compare(req.body.currentPassword, business.password);
      if (!isPasswordValid) {
        return res.status(401).send("Invalid password");
      }

      const updateFields = {
        firstname: req.body.firstname || business.firstname,
        lastname: req.body.lastname || business.lastname,
        description: req.body.description || business.description,
        businessDesc: req.body.businessDesc || business.businessDesc,
        governorate: req.body.governorate || business.governorate,
        municipality: req.body.municipality || business.municipality,
        businessLocation: req.body.businessLocation || business.businessLocation,
        mobileNum: req.body.mobileNum ? parseInt(req.body.mobileNum, 10) : business.mobileNum,
        image: req.body.image || business.image,
        businessName: req.body.businessName || business.businessName,
        businessImage: req.body.businessImage || business.businessImage,
      };

      if (req.body.newPassword) {
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        updateFields.password = hashedPassword;
      }

      const result = await db.Business.update(updateFields, {
        where: { idbusiness: req.params.idbusiness }
      });

      if (result[0] === 1) {
        const newData = await db.Business.findOne({ where: { idbusiness: req.params.idbusiness } });
        return res.status(200).send(newData);
      } else {
        return res.status(500).send("Failed to update business");
      }
    } catch (error) {
      console.error("Error updating business:", error);
      return res.status(500).send("Failed to update business");
    }
  },

  getBusinessPosts: async function(req, res) {
    const { idbusiness } = req.params;

    try {
      const business = await db.Business.findByPk(idbusiness);
      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }

      const posts = await db.Posts.findAll({
        where: { business_idbusiness: idbusiness },
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json(posts);
    } catch (error) {
      console.error("Error fetching business posts:", error);
      return res.status(500).json({ error: "Failed to fetch business posts" });
    }
  },

  getBusinessNumberPosts: async function(req, res) {
    const { idbusiness } = req.params;

    try {
      const business = await db.Business.findByPk(idbusiness);
      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }

      const posts = await db.Posts.findAll({
        where: { business_idbusiness: idbusiness },
        order: [['createdAt', 'DESC']],
      });
      const numOfPosts=posts.length
      await business.update({numOfPosts:numOfPosts})
      return res.status(200).json(numOfPosts);
    
    } catch (error) {
      console.error("Error fetching business posts:", error);
      return res.status(500).json({ error: "Failed to fetch business posts" });
    }
  },
  getPendingBusinesses: async function(req, res) {
    try {
      const pendingBusinesses = await db.Business.findAll({
        where: {
          approvalStatus: 'pending'
        }
      });
      return res.status(200).json(pendingBusinesses);
    } catch (error) {
      console.error("Error fetching pending businesses:", error);
      return res.status(500).json({ error: "Failed to fetch pending businesses" });
    }
  }}


