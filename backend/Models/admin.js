
const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
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

  return Admin;
};
