const User = require('../models/User');
const { successMessages, errorMessages } = require('../constants/common');
const { generateToken } = require('../utils/jwtUtils');

exports.registerUser = async (name, email, password, role = 'customer') => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error(errorMessages.USER_ALREADY_EXISTS);
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
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(errorMessages.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      throw new Error(errorMessages.INVALID_CREDENTIALS);
    }

    if (!user.isActive) {
      throw new Error(errorMessages.ACCOUNT_DEACTIVATED);
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
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getCurrentUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error(errorMessages.USER_NOT_FOUND);
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
  } catch (error) {
    console.error(error);
    throw error;
  }
};
