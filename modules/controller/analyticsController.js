const User = require("../../models/auth");
const Ticket = require("../../models/ticket");

// Get ticket history
const getTicketHistory = async (req, res) => {
    try {
        const { startDate, endDate, status, priority, type, venue } = req.query;

        const filters = {};
        if (startDate) filters.createdDate = { [Op.gte]: new Date(startDate) };
        if (endDate) filters.createdDate = { [Op.lte]: new Date(endDate) };
        if (status) filters.status = status;
        if (priority) filters.priority = priority;
        if (type) filters.type = type;
        if (venue) filters.venue = venue;

        const tickets = await Ticket.findAll({
            where: filters,
        });

        const totalTickets = tickets.length;
        const closedTickets = tickets.filter(ticket => ticket.status === 'closed').length;
        const openTickets = tickets.filter(ticket => ticket.status === 'open').length;
        const inProgressTickets = tickets.filter(ticket => ticket.status === 'in-progress').length;

        const priorityDistribution = tickets.reduce((acc, ticket) => {
            acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
            return acc;
        }, {});

        const typeDistribution = tickets.reduce((acc, ticket) => {
            acc[ticket.type] = (acc[ticket.type] || 0) + 1;
            return acc;
        }, {});

        res.json({
            totalTickets,
            closedTickets,
            openTickets,
            inProgressTickets,
            priorityDistribution,
            typeDistribution,
            tickets: tickets.map(ticket => ({
                id: ticket.id,
                title: ticket.title,
                status: ticket.status,
                priority: ticket.priority,
                type: ticket.type,
                venue: ticket.venue,
                createdDate: ticket.createdDate,
                createdBy: ticket.createdBy,
            })),
        });
    } catch (error) {
        console.error('Error getting ticket history:', error.message);
        res.status(400).json({ message: error.message });
    }
};

// Get ticket analytics
const getTicketAnalytics = async (req, res) => {
    try {
        const { startDate, endDate, status, priority, type, venue } = req.query;

        const filters = {};
        if (startDate) filters.createdDate = { [Op.gte]: new Date(startDate) };
        if (endDate) filters.createdDate = { [Op.lte]: new Date(endDate) };
        if (status) filters.status = status;
        if (priority) filters.priority = priority;
        if (type) filters.type = type;
        if (venue) filters.venue = venue;

        const tickets = await Ticket.findAll({
            where: filters,
        });

        const totalTickets = tickets.length;
        const closedTickets = tickets.filter(ticket => ticket.status === 'closed').length;
        const openTickets = tickets.filter(ticket => ticket.status === 'open').length;
        const inProgressTickets = tickets.filter(ticket => ticket.status === 'in-progress').length;

        const priorityDistribution = tickets.reduce((acc, ticket) => {
            acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
            return acc;
        }, {});

        const typeDistribution = tickets.reduce((acc, ticket) => {
            acc[ticket.type] = (acc[ticket.type] || 0) + 1;
            return acc;
        }, {});

        // Dummy values for average customer spending and average tickets booked per day
        const averageCustomerSpending = 500;
        const averageTicketsBookedPerDay = 100;

        res.json({
            totalTickets,
            closedTickets,
            openTickets,
            averageCustomerSpending,
            averageTicketsBookedPerDay,
            inProgressTickets,
            priorityDistribution,
            typeDistribution,
        });
    } catch (error) {
        console.error('Error getting ticket analytics:', error.message);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getTicketHistory,
    getTicketAnalytics,
};
