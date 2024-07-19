const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Explorer", {
    idexplorer: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    badge: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    numOfPosts: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    numOfVisits: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    numOfLikes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    coins: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    boughtItemName: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    boughtItemImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    selectedItemName: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    selectedItemImage: {  
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobileNum: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    
    governorate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    municipality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    categories: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};
