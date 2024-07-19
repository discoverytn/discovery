const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Chat = sequelize.define('Chat', {
        idchat: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        explorer_idexplorer: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        business_idbusiness: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });

    Chat.associate = (models) => {
        Chat.belongsTo(models.Explorer, {
          foreignKey: 'explorer_idexplorer',
          as: 'Explorer'
        });
        Chat.belongsTo(models.Business, {
          foreignKey: 'business_idbusiness',
          as: 'Business'
        });
      };

    return Chat;
}

