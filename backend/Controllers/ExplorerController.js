const db = require("../database/index");
const bcrypt = require('bcrypt');

module.exports = {
  editExplorer: function(req, res) {
    db.Explorer.findOne({ where: { email: req.body.email } })
      .then((explorer) => {
        if (!explorer) {
          return res.status(404).send("Invalid email");
        }

        bcrypt.compare(req.body.password, explorer.dataValues.password)
          .then((samepassword) => {
            if (samepassword) {
              
              if (req.body.newPassword) {
               
                bcrypt.hash(req.body.newPassword, 10)
                  .then((hashedNewPassword) => {
                    db.Explorer.update({
                      firstname: req.body.firstname,
                      lastname: req.body.lastname,
                      description : req.body.description,
                      image : req.body.image,
                      location : req.body.location,
                      mobileNum : req.body.mobileNum,
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
               
                db.Explorer.update({
                  firstname: req.body.firstname,
                  lastname: req.body.lastname,
                  description : req.body.description,
                  image : req.body.image,
                  location : req.body.location,
                  mobileNum : req.body.mobileNum,
                  
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
        console.error("Find Explorer error:", findError);
        res.status(500).send(findError);
      });
  },

};