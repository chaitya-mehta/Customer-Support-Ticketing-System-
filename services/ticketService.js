const { successMessages, errorMessages } = require('../constants/common');
const Ticket = require('../models/Tickets');
const { NotFoundError } = require('../utils/apiError');
const mongoose = require('mongoose');

exports.createTicket = async (data, userId, files) => {
  const attachments =
    files?.map((file) => ({
      fileName: file.originalname,
      filePath: file.path,
      fileType: file.mimetype
    })) || [];

  const ticket = await Ticket.create({
    ...data,
    createdBy: userId,
    attachments
  });

  return {
    ticket,
    message: successMessages.TICKET_SUCCESS
  };
};

exports.getTickets = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.category) filter.category = query.category;
  if (query.search) filter.title = { $regex: query.search, $options: 'i' };

  const [tickets, total] = await Promise.all([
    Ticket.find(filter)
      .populate('customer assignedAgent category createdBy modifiedBy')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Ticket.countDocuments(filter)
  ]);

  return {
    tickets,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalItems: total
  };
};

exports.getTicketById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new NotFoundError(errorMessages.TICKET_ERROR);
  }

  const ticket = await Ticket.findById(id)
    .populate('customer', 'name email')
    .populate('assignedAgent', 'name email')
    .populate('category', 'name')
    .populate('agentComments.agentId', 'name email');

  if (!ticket) {
    throw new NotFoundError(errorMessages.TICKET_ERROR);
  }

  return ticket;
};

exports.updateTicket = async (id, data, userId, files) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new NotFoundError(errorMessages.TICKET_ERROR);
  }

  const ticket = await Ticket.findById(id);
  if (!ticket) {
    throw new NotFoundError(errorMessages.TICKET_ERROR);
  }

  const newAttachments =
    files?.map((file) => ({
      fileName: file.originalname,
      filePath: file.path,
      fileType: file.mimetype
    })) || [];

  Object.assign(ticket, data);

  if (newAttachments.length > 0) {
    ticket.attachments.push(...newAttachments);
  }

  ticket.modifiedBy = userId;
  ticket.updatedAt = new Date();
  await ticket.save();

  return {
    ticket,
    message: successMessages.TICKET_UPDATE_SUCCESS
  };
};

exports.addAgentComment = async (ticketId, agentId, commentText) => {
  if (!mongoose.Types.ObjectId.isValid(ticketId)) {
    throw new NotFoundError(errorMessages.TICKET_ERROR);
  }

  const ticket = await Ticket.findByIdAndUpdate(
    ticketId,
    {
      $push: {
        agentComments: { agentId, commentText }
      }
    },
    { new: true }
  ).populate('agentComments.agentId', 'name email');

  if (!ticket) {
    throw new NotFoundError(errorMessages.TICKET_ERROR);
  }

  return {
    ticket,
    message: successMessages.AGENT_COMMENT_ADDED
  };
};
exports.getAllTicketsByUser = async (userId, query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = { createdBy: userId };

  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.category) filter.category = query.category;
  if (query.search) filter.title = { $regex: query.search, $options: 'i' };

  const [tickets, total] = await Promise.all([
    Ticket.find(filter)
      .populate('customer assignedAgent category createdBy modifiedBy')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Ticket.countDocuments(filter)
  ]);

  return {
    tickets,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalItems: total
  };
};
