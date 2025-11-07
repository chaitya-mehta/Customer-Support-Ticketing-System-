const { successMessages, errorMessages } = require("../constants/common");
const Ticket = require("../models/Tickets");
exports.createTicket = async (ticketData) => {
  try {
    const ticket = await Ticket.create(ticketData);
    return {
      ticket,
      message: successMessages.TICKET_CREATED,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
exports.getTicketById = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(errorMessages.TICKET_ERROR);
    }

    const ticket = await Ticket.findById(id)
      .populate("customer", "name email")
      .populate("assignedAgent", "name email")
      .populate("category", "name");

    if (!ticket) throw new Error(errorMessages.TICKET_ERROR);

    return ticket;
  } catch (error) {
    throw new Error(error.message);
  }
};
exports.updateTicket = async (ticketId, updateData, userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      throw new Error(errorMessages.TICKET_ERROR);
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new Error(errorMessages.TICKET_ERROR);

    Object.assign(ticket, updateData, { modifiedBy: userId });
    await ticket.save();

    return {
      ticket,
      message: successMessages.TICKET_UPDATE_SUCCESS,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
