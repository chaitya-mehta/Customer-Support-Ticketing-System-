const { errorMessages, successMessages } = require('../constants/common');
const mongoose = require('mongoose');
const User = require('../models/User');

exports.getAllUsers = async (query) => {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

    const filters = {};

    if (query.isActive !== undefined) filters.isActive = query.isActive === 'true';
    else filters.isActive = true;

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
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};
exports.getUser = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(errorMessages.USER_NOT_FOUND);
    }
    const user = await User.findById(id);
    if (!user) {
      throw new Error(errorMessages.USER_NOT_FOUND);
    }
    return user;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};
exports.updateUser = async (currentLoginUserId, userId, updateData) => {
  try {
    const fieldsToUpdate = {
      name: updateData.name,
      modifiedBy: currentLoginUserId
    };

    const user = await User.findByIdAndUpdate(userId, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    if (!user) {
      throw new Error(errorMessages.USER_NOT_FOUND);
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
  } catch (error) {
    console.error(error);
    throw error.message;
  }
};
