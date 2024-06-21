require("dotenv").config();
const express = require("express");
const userRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const db = require("./database/index");
const app = express();

app.use(express.json());

app.use("/admin", userRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`); 
});
