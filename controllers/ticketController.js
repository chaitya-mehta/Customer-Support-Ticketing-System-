const ticketService = require('../services/ticketService');

exports.createTicket = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      customer: req.user.id
    };

    const result = await ticketService.createTicket(data, req.user.id, req.files);

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

exports.getAllTickets = async (req, res, next) => {
  try {
    const result = await ticketService.getTickets(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

exports.getTicketById = async (req, res, next) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

exports.updateTicket = async (req, res, next) => {
  try {
    const { commentText } = req.body;
    const result = await ticketService.updateTicket(req.params.id, commentText, req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

exports.addAgentComment = async (req, res, next) => {
  try {
    const { commentText, status } = req.body;
    const ticketId = req.params.id;
    const userId = req.user.id;
    const ticket = await ticketService.addAgentComment(ticketId, userId, commentText, status);
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};
exports.getAllTicketsByUser = async (req, res, next) => {
  try {
    const result = await ticketService.getAllTicketsByUser(req.user.id, req.query);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
