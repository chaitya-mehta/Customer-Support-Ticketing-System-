const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const ticketController = require('../controllers/ticketController');
const { createTicketSchema } = require('../validations/ticketValidation');
const { validateRequest } = require('../middleware/validation');
const upload = require('../middleware/upload');

const router = express.Router();

router.post(
  '/',
  protect,
  upload.array('attachments', 5),
  validateRequest(createTicketSchema),
  ticketController.createTicket
);
router.get('/', protect, authorize('admin', 'agent'), ticketController.getAllTickets);
router.get('/user', protect, ticketController.getAllTicketsByUser);
router.get('/:id', protect, ticketController.getTicketById);
router.put('/:id', protect, ticketController.updateTicket);
router.post('/:id/agent-comment', protect, ticketController.addAgentComment);
module.exports = router;
