// admin.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Sequelize instance

const Admin = sequelize.define('admin', {
  idadmin: {
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
  badge: DataTypes.STRING
});

module.exports = Admin;
