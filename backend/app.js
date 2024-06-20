
require("dotenv").config();
const express = require("express");
const adminRoutes = require("./Routes/adminRoutes");
const authRoutes = require("./Routes/authRoutes");
const db = require("./database/index");
const app = express();

app.use(express.json());

app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

db.sequelize.sync({ force: false }) 
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to sync database:", error);
  });
