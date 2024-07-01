// const bcrypt = require('bcrypt');
// const db = require('../database/index');
// module.exports = {
//   getBusinessById: async function(req, res) {
//     try {
//       const business = await db.Business.findByPk(req.params.idbusiness);
//       if (!business) {
//         return res.status(404).send("Business not found");
//       }
//       return res.status(200).json(business);
//     } catch (error) {
//       console.error("Error fetching business:", error);
//       return res.status(500).send("Failed to fetch business");
//     }
//   },

//   editBusiness: async (req, res) => {
//     const { idbusiness } = req.params;
//     const {
//       firstname,
//       lastname,
//       description,
//       businessDesc,
//       governorate,
//       municipality,
//       businessLocation,
//       mobileNum,
//       image,
//       businessName,
//       businessImage,
//       currentPassword,
//       newPassword,
//     } = req.body;

//     try {
//       const business = await db.Business.findByPk(idbusiness);

//       if (!business) {
//         return res.status(404).json({ error: 'Business not found' });
//       }

      
//       business.firstname = firstname;
//       business.lastname = lastname;
//       business.description = description;
//       business.businessDesc = businessDesc;
//       business.governorate = governorate;
//       business.municipality = municipality;
//       business.businessLocation = businessLocation;
//       business.mobileNum = parseInt(mobileNum, 10); 
//       business.image = image;
//       business.businessName = businessName;
//       business.businessImage = businessImage;

      
//       if (newPassword) {
//         const isMatch = await bcrypt.compare(currentPassword, business.password);

//         if (!isMatch) {
//           return res.status(400).json({ error: 'Current password does not match' });
//         }

//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
//         business.password = hashedPassword;
//       }

//       await business.save();

//       return res.status(200).json({ message: 'Business updated successfully', business });
//     } catch (error) {
//       console.error('Error updating business:', error);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//   },

//   getBusinessPosts: async function(req, res) {
//     const { idbusiness } = req.params;

//     try {
//       const business = await db.Business.findByPk(idbusiness);
//       if (!business) {
//         return res.status(404).json({ error: "Business not found" });
//       }

//       const posts = await db.Posts.findAll({
//         where: { business_idbusiness: idbusiness },
//         order: [['createdAt', 'DESC']],
//       });

//       return res.status(200).json(posts);
//     } catch (error) {
//       console.error("Error fetching business posts:", error);
//       return res.status(500).json({ error: "Failed to fetch business posts" });
//     }
//   },
// };

const bcrypt = require('bcrypt');
const db = require('../database/index'); 

module.exports = {
  getBusinessById: async function(req, res) {
    try {
      const business = await db.Business.findByPk(req.params.idbusiness);
      if (!business) {
        return res.status(404).send("Business not found");
      }
      return res.status(200).json(business);
    } catch (error) {
      console.error("Error fetching business:", error);
      return res.status(500).send("Failed to fetch business");
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
};
