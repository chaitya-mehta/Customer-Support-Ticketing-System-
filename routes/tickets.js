const express = require('express');
const { protect } = require('../middleware/auth');
const ticketController = require('../controllers/ticketController');
const { createTicketSchema, updateTicketSchema } = require('../validations/ticketValidation');
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
router.get('/', protect, ticketController.getAllTickets);
router.get('/:id', protect, ticketController.getTicketById);
router.put('/:id', protect, validateRequest(updateTicketSchema), ticketController.updateTicket);
router.post('/:id/agent-comment', protect, ticketController.addAgentComment);
module.exports = router;
