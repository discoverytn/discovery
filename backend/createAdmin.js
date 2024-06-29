const bcrypt = require("bcryptjs");
const db = require("./database/index");

(async () => {
  try {
    const pw = "admin";
    const hashedPassword = await bcrypt.hash(pw, 10);
    const admin = await db.Admin.create({
      name: "admin",
      email :"admin@gmail.com",
      password: hashedPassword
      
    });
    console.log("admin created:", admin);
  } catch (error) {
    console.error("error:", error);
  }
})();