require("dotenv").config();
const express = require("express");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const db = require("./database/index");
const app = express();

app.use(express.json());

app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT ;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`); 
});
