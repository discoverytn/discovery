const { DataTypes } = require('sequelize');
const sequelize = require('../database/index.js'); 

const Favorites = sequelize.define('favorites', {
  // joint table
});

module.exports = Favorites;
