const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const OTP = sequelize.define('OTP', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  otp: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

(async () => {
    try {
      await sequelize.sync();
      console.log('OTP Database synchronized successfully');
    } catch (error) {
      console.error('Error synchronizing database:', error);
    }
  })();

module.exports = OTP;