const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Chat', {
    idchat: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    message: DataTypes.STRING,
    explorer_idexplorer: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Explorers', 
        key: 'idexplorer',
      }
    },
    business_idbusiness: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Businesses', 
        key: 'idbusiness',
      }
    }
  });
};
