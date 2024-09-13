const express = require('express');
const router = express.Router();
const ticketController = require('../controller/ticketController');
const analyticsController = require('../controller/analyticsController');
const { verifyToken } = require('../../middleware/verifytoken');

// POST /ticket - Create a new ticket
router.post('/ticket', verifyToken, ticketController.createTicket);
router.post('/tickets/:ticketId/assign', verifyToken, ticketController.assignUserToTicket);

// GET /tickets/:ticketId - Get ticket details
router.get('/tickets/:ticketId', verifyToken, ticketController.getTicketDetails);
router.get('/tickets/analytics', verifyToken, analyticsController.getTicketHistory);

// GET /dashboard/analytics - Get ticket analytics
router.get('/dashboard/analytics', verifyToken, analyticsController.getTicketAnalytics);

// POST /tickets/:
module.exports = router;