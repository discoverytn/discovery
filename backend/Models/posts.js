const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Posts', {
    idposts: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hashtags: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    long: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    latt: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    image1: {
      type: DataTypes.STRING,
<<<<<<< HEAD
      allowNull: false 
=======
      allowNull: true 
>>>>>>> 9860a3bf0a78ca7211eda5d920fcd6980f3be129
    },
    image2: {
      type: DataTypes.STRING,
      allowNull: true 
    },
    image3: {
      type: DataTypes.STRING,
      allowNull: true 
    },
    image4: {
      type: DataTypes.STRING,
      allowNull: true 
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    explorer_idexplorer: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    business_idbusiness: {
      type: DataTypes.INTEGER,
      allowNull: true
<<<<<<< HEAD
    },
    numOfRatings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    totalRating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    averageRating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
=======
>>>>>>> 9860a3bf0a78ca7211eda5d920fcd6980f3be129
    }
  });
};
