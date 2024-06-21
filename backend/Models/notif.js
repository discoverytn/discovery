const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Notif', {
    idnotif: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    message: DataTypes.STRING,
    business_idbusiness: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Businesses', 
        key: 'idbusiness',
      }
    },
    explorer_idexplorer: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Explorer', 
        key: 'idexplorer',
      }
    }
  });
};
