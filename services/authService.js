const User = require('../models/User');
const { successMessages, errorMessages } = require('../constants/common');
const { generateToken } = require('../utils/jwtUtils');
const { BadRequestError, ForbiddenError, NotFoundError } = require('../utils/apiError');

exports.registerUser = async (name, email, password, role = 'customer') => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError(errorMessages.USER_ALREADY_EXISTS);
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    message: successMessages.REGISTER_SUCCESS
  };
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError(errorMessages.INVALID_CREDENTIALS);
  }

  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) {
    throw new BadRequestError(errorMessages.INVALID_CREDENTIALS);
  }

  if (!user.isActive) {
    throw new ForbiddenError(errorMessages.ACCOUNT_DEACTIVATED);
  }

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token,
    message: successMessages.LOGIN_SUCCESS
  };
};

exports.getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError(errorMessages.USER_NOT_FOUND);
  }

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    }
  };
};
