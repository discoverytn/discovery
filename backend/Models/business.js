// business.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Sequelize instance

const Business = sequelize.define('business', {
  idbusiness: {
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
  mobileNum: DataTypes.STRING,
  numOfReviews: DataTypes.STRING,
  businessName: DataTypes.STRING,
  businessDesc: DataTypes.STRING,
  businessImg: DataTypes.STRING,
  long: DataTypes.DECIMAL,
  latt: DataTypes.DECIMAL
});

module.exports = Business;
