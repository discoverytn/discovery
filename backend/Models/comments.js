// comments.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Sequelize instance

const Comments = sequelize.define('comments', {
  idcomments: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
});

module.exports = Comments;
