const User = require("../../models/auth");
const Ticket = require("../../models/ticket");

// Create a new ticket
const createTicket = async (req, res) => {
    try {
        const ticketData = req.body;

        // Verify that the user exists
        const user = await User.findByPk(ticketData.createdBy);
        if (!user) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Verify the due date is in the future
        if (new Date(ticketData.dueDate) <= new Date()) {
            return res.status(400).json({ message: 'Due date must be in the future' });
        }

        // Create the ticket
        const ticket = await Ticket.create(ticketData);

        res.status(201).json({
            id: ticket.id,
            title: ticket.title,
            description: ticket.description,
            type: ticket.type,
            venue: ticket.venue,
            status: ticket.status,
            price: ticket.price,
            priority: ticket.priority,
            dueDate: ticket.dueDate,
            createdBy: ticket.createdBy,
            assignedUsers: [],
        });
    } catch (error) {
        console.error('Error creating ticket:', error.message);
        res.status(400).json({ message: error.message });
    }
};

// Assign a user to a ticket
const assignUserToTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { userId } = req.body;

        // Ensure ticket and user exist
        const ticket = await Ticket.findByPk(ticketId);
        const user = await User.findByPk(userId);

        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check ticket status and user assignment limits
        if (ticket.status === 'closed') return res.status(400).json({ message: 'Cannot assign users to a closed ticket' });

        const assignedUsers = await ticket.getAssignedUsers();
        if (assignedUsers.length >= 5) return res.status(400).json({ message: 'User assignment limit reached' });
        if (user.type === 'admin') return res.status(400).json({ message: 'Cannot assign tickets to admins' });
        if (assignedUsers.some(assignedUser => assignedUser.id === userId)) return res.status(400).json({ message: 'User already assigned' });

        // Authorization checks
        if (req.user.type !== 'admin' && req.user.id !== ticket.createdBy) return res.status(403).json({ message: 'Unauthorized' });

        // Assign user to ticket
        await ticket.addAssignedUsers(userId);

        res.json({ message: 'User assigned successfully' });
    } catch (error) {
        console.error('Error assigning user to ticket:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Get ticket details
const getTicketDetails = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const ticket = await Ticket.findByPk(ticketId, {
            include: [{ model: User, as: 'assignedUsers' }]
        });

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json({
            id: ticket.id,
            title: ticket.title,
            description: ticket.description,
            type: ticket.type,
            venue: ticket.venue,
            status: ticket.status,
            price: ticket.price,
            priority: ticket.priority,
            dueDate: ticket.dueDate,
            createdBy: ticket.createdBy,
            assignedUsers: ticket.assignedUsers.map(user => ({
                userId: user.id,
                name: user.name,
                email: user.email
            })),
            statistics: {
                totalAssigned: ticket.assignedUsers.length,
                status: ticket.status
            }
        });
    } catch (error) {
        console.error('Error getting ticket details:', error.message);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createTicket,
    assignUserToTicket,
    getTicketDetails,
};
