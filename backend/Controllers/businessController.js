const db = require("../database/index");
const bcrypt = require('bcrypt');

module.exports = {
  BOEditProfile: function(req, res) {
    db.Business.findOne({ where: { email: req.body.email } })
      .then((business) => {
        if (!business) {
          return res.status(404).send("Invalid email");
        }

        bcrypt.compare(req.body.password, business.dataValues.password)
          .then((samepassword) => {
            if (samepassword) {
              
              if (req.body.newPassword) {
               
                bcrypt.hash(req.body.newPassword, 10)
                  .then((hashedNewPassword) => {
                    db.Business.update({
                      firstname: req.body.firstname,
                      lastname: req.body.lastname,
                      description : req.body.description,
                      image : req.body.image,
                      location : req.body.location,
                      mobileNum : req.body.mobileNum,
                      businessName : req.body.businessName,
                      businessDesc : req.body.businessDesc,
                      businessImg : req.body.businessImg,
                      long : req.body.long,
                      latt : req.body.latt,
                      password: hashedNewPassword
                    }, { where: { email: req.body.email } })
                      .then((result) => {
                        res.send(result);
                      })
                      .catch((updateError) => {
                        console.error("Update error:", updateError);
                        res.status(500).send(updateError);
                      });
                  })
                  .catch((hashError) => {
                    console.error("Hash error:", hashError);
                    res.status(500).send(hashError);
                  });
              } else {
               
                db.Business.update({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    description : req.body.description,
                    image : req.body.image,
                    location : req.body.location,
                    mobileNum : req.body.mobileNum,
                    businessName : req.body.businessName,
                    businessDesc : req.body.businessDesc,
                    businessImg : req.body.businessImg,
                    long : req.body.long,
                    latt : req.body.latt,
                }, { where: { email: req.body.email } })
                  .then((result) => {
                    res.send(result);
                  })
                  .catch((updateError) => {
                    console.error("Update error:", updateError);
                    res.status(500).send(updateError);
                  });
              }
            } else {
              res.status(401).send("Invalid password");
            }
          })
          .catch((compareError) => {
            console.error("Password comparison error:", compareError);
            res.status(500).send(compareError);
          });
      })
      .catch((findError) => {
        console.error("Find Business Owner error:", findError);
        res.status(500).send(findError);
      });
  },

  
};