const { successMessages, errorMessages } = require('../constants/common');
const Ticket = require('../models/Tickets');
const { addNotificationJob } = require('../queues/notificationQueue');
const { NotFoundError } = require('../utils/apiError');
const mongoose = require('mongoose');

exports.createTicket = async (data, userId, files) => {
  const attachments =
    files?.map((file) => ({
      filename: file.originalname,
      path: file.path,
      uploadedBy: userId
    })) || [];

  const ticket = await Ticket.create({
    ...data,
    createdBy: userId,
    attachments
  });
  await addNotificationJob({
    type: 'ticket.created',
    payload: {
      ticketId: ticket._id,
      name: ticket.name,
      priority: ticket.priority,
      category: ticket.category,
      createdBy: ticket.createdBy
    },
    userId: userId
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
  if (query.search) filter.name = { $regex: query.search, $options: 'i' };

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
    totalRecords: total
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

exports.updateTicket = async (id, commentText, userId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new NotFoundError(errorMessages.TICKET_ERROR);
  }

  const ticket = await Ticket.findById(id);
  if (!ticket) {
    throw new NotFoundError(errorMessages.TICKET_ERROR);
  }

  ticket.commentText = commentText?.trim();
  ticket.modifiedBy = userId;
  ticket.updatedAt = new Date();
  await ticket.save();
  await addNotificationJob({
    type: 'ticket.updated',
    payload: { ticketId: ticket._id, comment: commentText?.trim() },
    userId: userId
  });

  return {
    ticket,
    message: successMessages.TICKET_UPDATE_SUCCESS
  };
};

exports.addAgentComment = async (ticketId, userId, commentText, newStatus = null) => {
  if (!mongoose.Types.ObjectId.isValid(ticketId)) {
    throw new NotFoundError(errorMessages.TICKET_ERROR);
  }
  const existingTicket = await Ticket.findById(ticketId);
  if (!existingTicket) {
    throw new NotFoundError(errorMessages.TICKET_ERROR);
  }
  const updateData = {
    $push: {
      agentComments: {
        agentId: userId,
        commentText: commentText
      }
    },
    modifiedBy: userId
  };
  updateData.status = newStatus || existingTicket.status;
  const ticket = await Ticket.findByIdAndUpdate(ticketId, updateData, { new: true })
    .populate('agentComments.agentId', 'name email')
    .populate('assignedAgent', 'name email')
    .populate('customer', 'name email');

  // if (!ticket) {
  //   throw new NotFoundError(errorMessages.TICKET_ERROR);
  // }
  await addNotificationJob({
    type: 'ticket.status.updated',
    payload: { ticketId: ticket._id, status: ticket.status, comment: commentText?.trim() },
    userId: ticket.createdBy
  });

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
