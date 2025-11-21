const userService = require('../services/userService');

exports.getAllUsers = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers(req.query);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
exports.getAllAgents = async (req, res, next) => {
  try {
    const result = await userService.getAllAgents();
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUser(req.params.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
exports.updateUser = async (req, res, next) => {
  try {
    const updateData = {
      name: req.body.name
    };

    const result = await userService.updateUser(req.user.id, req.params.id, updateData);

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        user: result.user
      }
    });
  } catch (error) {
    next(error);
  }
};
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isActive = req.body.isActive;

    const result = await userService.toggleUserStatus(req.user.id, id, isActive);

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        user: result.user
      }
    });
  } catch (error) {
    next(error);
  }
};
