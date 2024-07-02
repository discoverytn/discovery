const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Traveled', {
    idtraveled: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
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
    post_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    post_image1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    post_location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
