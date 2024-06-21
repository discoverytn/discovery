
const { DataTypes } = require('sequelize');
const sequelize = require('../database/index.js'); 
module.exports = (sequelize, DataTypes) => {
const Posts = sequelize.define('posts', {
  idposts: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  images: DataTypes.STRING,
  desc: DataTypes.STRING,
  hashtags: DataTypes.STRING,
  category: DataTypes.STRING,
  reviews: DataTypes.DECIMAL,
  lang: DataTypes.DECIMAL,
  latt: DataTypes.DECIMAL
});

return Posts;
}
