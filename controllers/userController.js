const userService = require('../services/userService');

exports.getAllUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsers(req.query);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUser(req.params.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
};
exports.updateUser = async (req, res) => {
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
    res.status(404).json({
      success: false,
      error: error
    });
  }
};
