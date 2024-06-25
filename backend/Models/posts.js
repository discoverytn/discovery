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
      allowNull: false // Required field
    },
    image2: {
      type: DataTypes.STRING,
      allowNull: true // Optional field
    },
    image3: {
      type: DataTypes.STRING,
      allowNull: true // Optional field
    },
    image4: {
      type: DataTypes.STRING,
      allowNull: true // Optional field
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
    }
  });
};
