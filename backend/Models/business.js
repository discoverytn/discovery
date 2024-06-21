const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Business', {
    idbusiness: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    badge: {
      type: DataTypes.STRING,
      allowNull: true
    },
    numOfPosts: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mobileNum: {
      type: DataTypes.STRING,
      allowNull: true
    },
    numOfReviews: {
      type: DataTypes.STRING,
      allowNull: true
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    businessDesc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    businessImg: {
      type: DataTypes.STRING,
      allowNull: true
    },
    BOid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    credImg: {
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
    }
  });
};
