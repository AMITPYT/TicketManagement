// const { DataTypes, Model, ENUM } = require('sequelize');
// const sequelize = require('../config/db.js'); // Assume you have the database configured
// const User = require('./auth.js');

// const Ticket = sequelize.define('Ticket', {
//     title: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     description: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//     },
//     type: {
//         type: ENUM('concert', 'conference', 'sports'),
//         allowNull: false,
//     },
//     venue: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     status: {
//         type: ENUM('open', 'in-progress', 'closed'),
//         defaultValue: 'open',
//     },
//     price: {
//         type: DataTypes.FLOAT,
//         allowNull: false,
//     },
//     priority: {
//         type: ENUM('low', 'medium', 'high'),
//         allowNull: false,
//     },
//     dueDate: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         validate: {
//             isAfter: new Date().toISOString(), // Ensures it's a future date
//         },
//     },
//      createdBy: {
//         type: DataTypes.INTEGER,
//         references: {
//             model: User,
//             key: 'id',
//         },
//     },
//     assignedUsers: {
//         type: DataTypes.ARRAY(DataTypes.JSONB), // Use JSONB for PostgreSQL
//         defaultValue: []
//     },
// });

// Ticket.belongsToMany(User, { through: 'TicketAssignments', as: 'assignedUsers', foreignKey: 'ticketId' });
// User.belongsToMany(Ticket, { through: 'TicketAssignments', as: 'assignedTickets', foreignKey: 'userId' });

// (async () => {
//     try {
//       await sequelize.sync();
//       console.log( 'Ticket Database synchronized successfully');
//     } catch (error) {
//       console.error('Error synchronizing database:', error);
//     }
//   })()

// module.exports = Ticket;



const { DataTypes, Model, ENUM } = require('sequelize');
const sequelize = require('../config/db.js');
const User = require('./auth.js');

const Ticket = sequelize.define('Ticket', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    type: {
        type: ENUM('concert', 'conference', 'sports'),
        allowNull: false,
    },
    venue: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: ENUM('open', 'in-progress', 'closed'),
        defaultValue: 'open',
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    priority: {
        type: ENUM('low', 'medium', 'high'),
        allowNull: false,
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isAfter: new Date().toISOString(), // Ensures it's a future date
        },
    },
    createdBy: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
});

Ticket.belongsToMany(User, { through: 'TicketAssignments', as: 'assignedUsers', foreignKey: 'ticketId' });
User.belongsToMany(Ticket, { through: 'TicketAssignments', as: 'assignedTickets', foreignKey: 'userId' });


(async () => {
    try {
      await sequelize.sync();
      console.log('Ticket Database synchronized successfully');
    } catch (error) {
      console.error('Error synchronizing database:', error);
    }
})();

module.exports = Ticket;
