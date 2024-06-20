const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Admin = require("../models/admin.js")(sequelize, DataTypes);
db.Explorer = require("../models/explorer.js")(sequelize, DataTypes);
db.Business = require("../models/business.js")(sequelize, DataTypes);
db.Posts = require("../models/posts.js")(sequelize, DataTypes);
db.Comments = require("../models/comments.js")(sequelize, DataTypes);
db.Notif = require("../models/notif.js")(sequelize, DataTypes);
db.Chat = require("../models/chat.js")(sequelize, DataTypes);
db.Events = require("../models/events.js")(sequelize, DataTypes);
db.Favorites = require("../models/favorites.js")(sequelize, DataTypes);

// Define associations
db.Explorer.hasMany(db.Posts, { foreignKey: "explorer_idexplorer" });
db.Business.hasMany(db.Posts, { foreignKey: "business_idbusiness" });
db.Posts.belongsTo(db.Explorer, { foreignKey: "explorer_idexplorer" });
db.Posts.belongsTo(db.Business, { foreignKey: "business_idbusiness" });

db.Posts.hasMany(db.Comments, { foreignKey: "posts_idposts" });
db.Comments.belongsTo(db.Posts, { foreignKey: "posts_idposts" });
db.Comments.belongsTo(db.Explorer, { foreignKey: "explorer_idexplorer" });

db.Business.hasMany(db.Notif, { foreignKey: "business_idbusiness" });
db.Explorer.hasMany(db.Notif, { foreignKey: "explorer_idexplorer" });
db.Notif.belongsTo(db.Business, { foreignKey: "business_idbusiness" });
db.Notif.belongsTo(db.Explorer, { foreignKey: "explorer_idexplorer" });

db.Explorer.hasMany(db.Chat, { foreignKey: "explorer_idexplorer" });
db.Business.hasMany(db.Chat, { foreignKey: "business_idbusiness" });
db.Chat.belongsTo(db.Explorer, { foreignKey: "explorer_idexplorer" });
db.Chat.belongsTo(db.Business, { foreignKey: "business_idbusiness" });

db.Explorer.hasMany(db.Events, { foreignKey: "explorer_idexplorer" });
db.Business.hasMany(db.Events, { foreignKey: "business_idbusiness" });
db.Events.belongsTo(db.Explorer, { foreignKey: "explorer_idexplorer" });
db.Events.belongsTo(db.Business, { foreignKey: "business_idbusiness" });

db.Posts.belongsToMany(db.Explorer, { through: db.Favorites, foreignKey: "posts_idposts" });
db.Explorer.belongsToMany(db.Posts, { through: db.Favorites, foreignKey: "explorer_idexplorer" });
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// sequelize
//   .sync({ force: true })
//   .then(() => {
//     console.log("Tables created successfully!");
//   })
//   .catch((error) => {
//     console.error("Unable to create tables:", error);
//   });

module.exports = db;