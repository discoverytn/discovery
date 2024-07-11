const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Payment", {
    idpayment: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cardholderName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    business_idbusiness: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Businesses',
        key: 'idbusiness',
      },
    },
  });
};