const { DataTypes } = require('sequelize');

function userModel (dataBase) {
    const User = dataBase.define('User', {
        // Model attributes are defined here
        nickname: {
          type: DataTypes.STRING,
          allowNull: false
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false
        }
      }, {
        // Other model options go here
        tableName: 'users'
    });

    return User;
}

module.exports = {userModel}