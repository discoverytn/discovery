const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Chat', {
    idchat: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    explorer_idexplorer: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Explorers', 
        key: 'idexplorer',
      },allowNull: false,
    },
    business_idbusiness: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Businesses', 
        key: 'idbusiness',
      },allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }

  });
};
