const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('TicketManagement', 'postgres', '123456789', {
  host: 'localhost', 
  port: 5432,
  dialect: 'postgres', 
});

module.exports = sequelize;