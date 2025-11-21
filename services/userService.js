const { errorMessages, successMessages } = require('../constants/common');
const mongoose = require('mongoose');
const User = require('../models/User');
const { NotFoundError } = require('../utils/apiError');

exports.getAllUsers = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

  const filters = {};

  if (query.isActive !== undefined) filters.isActive = query.isActive === 'true';

  if (query.role) filters.role = query.role;

  if (query.search) {
    const regex = new RegExp(query.search, 'i');
    filters.$or = [{ name: regex }, { email: regex }];
  }

  const users = await User.find(filters)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .select('-password');

  const total = await User.countDocuments(filters);

  return {
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalRecords: total,
    data: users
  };
};
exports.getUser = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new NotFoundError(errorMessages.USER_NOT_FOUND);
  }
  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundError(errorMessages.USER_NOT_FOUND);
  }
  return user;
};
exports.getAllAgents = async () => {
  const agents = await User.find({ role: 'agent', isActive: true }).select('-password');
  return agents;
};
exports.updateUser = async (currentLoginUserId, userId, updateData) => {
  const fieldsToUpdate = {
    name: updateData.name,
    modifiedBy: currentLoginUserId
  };

  const user = await User.findByIdAndUpdate(userId, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  if (!user) {
    throw new NotFoundError(errorMessages.USER_NOT_FOUND);
  }

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    message: successMessages.PROFILE_UPDATE_SUCCESS
  };
};
exports.toggleUserStatus = async (currentLoginUserId, userId, isActive) => {
  const fieldsToUpdate = {
    isActive: isActive,
    modifiedBy: currentLoginUserId
  };

  const user = await User.findByIdAndUpdate(userId, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  if (!user) {
    throw new NotFoundError(errorMessages.USER_NOT_FOUND);
  }

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    },
    message: successMessages.USER_STATUS_TOGGLE_SUCCESS
  };
};
