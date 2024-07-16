const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Market', {
    idmarket: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    itemDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    itemPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    itemImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    admin_idadmin: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Admins',
        key: 'idadmin',
      },
      allowNull: false,
    },
  });
};
