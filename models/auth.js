const { DataTypes, Model, ENUM } = require('sequelize');
const sequelize = require('../config/db.js');


const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: ENUM('admin', 'cutomer'),
      allowNull: false,
    },
});


(async () => {
  try {
    await sequelize.sync();
    console.log( 'User Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
})()

module.exports = User;