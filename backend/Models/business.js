const { DataTypes } = require("sequelize");
const { Business } = require("../database"); 
module.exports=(sequelize)=>{
  return sequelize.define('Business',{
    idbusiness:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
    },
    username : {
      type:DataTypes.STRING,
      allowNull:false,
      unique:true 
    },
    firstname:{
      type:DataTypes.STRING,
      allowNull:true
    },
    lastname :{
      type:DataTypes.STRING,
      allowNull:true
    },
    email :{
      type:DataTypes.STRING,
  allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    governorate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    municipality: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    location: {
      type: DataTypes.STRING,
      allowNull: true,
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
    },
    mobileNum: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    numOfReviews: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessDesc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    businessImg: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    BOid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    credImg: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    long: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    latt: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    resetCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    approvalStatus: {
      type: DataTypes.ENUM('pending', 'accepted'),
      allowNull: false,
      defaultValue: 'pending', 
    },
    subscribed: {
      type: DataTypes.ENUM('no', 'yes'),
      allowNull: false,
      defaultValue: 'no', 
    }
  });
};
