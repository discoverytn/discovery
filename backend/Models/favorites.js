// favorites.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Sequelize instance

const Favorites = sequelize.define('favorites', {
  // No additional fields needed, since this is a junction table
});

module.exports = Favorites;
