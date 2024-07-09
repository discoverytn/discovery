const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Notif', {
    idnotif: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
<<<<<<< HEAD
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
=======
>>>>>>> 9860a3bf0a78ca7211eda5d920fcd6980f3be129
    message: DataTypes.STRING,
    business_idbusiness: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Businesses', 
        key: 'idbusiness',
      }
    },
    explorer_idexplorer: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Explorers', 
        key: 'idexplorer',
      }
<<<<<<< HEAD
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    senderImage: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
=======
    }
  });
};
>>>>>>> 9860a3bf0a78ca7211eda5d920fcd6980f3be129
