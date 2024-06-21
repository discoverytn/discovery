const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Posts', {
    idposts: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    explorer_idexplorer: DataTypes.INTEGER,
    business_idbusiness: DataTypes.INTEGER
  });
};
