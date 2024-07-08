// database/index.js
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Admin = require('../Models/admin')(sequelize, DataTypes);
db.Explorer = require('../Models/explorer')(sequelize, DataTypes);
db.Business = require('../Models/business')(sequelize, DataTypes);
db.Posts = require('../Models/posts')(sequelize, DataTypes);
db.Comments = require('../Models/comments')(sequelize, DataTypes);
db.Notif = require('../Models/notif')(sequelize, DataTypes);
db.Chat = require('../Models/chat')(sequelize, DataTypes);
db.Events = require('../Models/events')(sequelize, DataTypes);
db.Favorites = require('../Models/favorites')(sequelize, DataTypes);

db.Explorer.hasMany(db.Chat, { foreignKey: 'explorer_idexplorer' });
db.Business.hasMany(db.Chat, { foreignKey: 'business_idbusiness' });
db.Chat.belongsTo(db.Explorer, { foreignKey: 'explorer_idexplorer', as: 'ExplorerInfo' });
db.Chat.belongsTo(db.Business, { foreignKey: 'business_idbusiness', as: 'BusinessInfo' });

sequelize.authenticate()
    .then(() => {
        console.log("Database connected...");
    })
    .catch((err) => {
        console.error("Unable to connect to the database:", err);
    });

module.exports = db;
