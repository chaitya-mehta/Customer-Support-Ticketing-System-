const ticketService = require("../services/ticketService");

exports.createTicket = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    if (!name?.trim() || !description?.trim() || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, description, and category are required.",
      });
    }

    const result = await ticketService.createTicket({
      ...req.body,
      customer: req.user._id,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: result.message,
      data: { ticket: result.ticket },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      status,
      priority,
    } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    const result = await ticketService.getAllTickets(
      page,
      limit,
      sortBy,
      sortOrder,
      filters
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const result = await ticketService.updateTicket(
      req.params.id,
      req.body,
      req.user._id
    );
    res.status(200).json({
      success: true,
      message: result.message,
      data: result.ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
