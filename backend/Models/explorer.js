// explorer.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Sequelize instance

const Explorer = sequelize.define('explorer', {
  idexplorer: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstname: DataTypes.STRING,
  lastname: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  description: DataTypes.STRING,
  image: DataTypes.STRING,
  badge: DataTypes.STRING,
  numOfPosts: DataTypes.STRING,
  numOfVisits: DataTypes.STRING,
  coins: DataTypes.STRING,
  mobileNum: DataTypes.STRING,
  numOfreviews: DataTypes.STRING,
  long: DataTypes.DECIMAL,
  latt: DataTypes.DECIMAL
});

module.exports = Explorer;
