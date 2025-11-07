const express = require("express");
const { protect } = require("../middleware/auth");
const ticketController = require("../controllers/ticketController");

const router = express.Router();

router.post("/", protect, ticketController.createTicket);
router.get("/", protect, ticketController.getAllTickets);
router.get("/:id", protect, ticketController.getTicketById);
router.put("/:id", protect, ticketController.updateTicket);

module.exports = router;
