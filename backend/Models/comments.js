const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Comments', {
    idcomments: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: DataTypes.TEXT,
    posts_idposts: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Posts', 
        key: 'idposts',
      }
    },
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