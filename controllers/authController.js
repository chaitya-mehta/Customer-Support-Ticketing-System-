const authService = require("../services/authService");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await authService.registerUser(name, email, password, role);
    res.status(201).json({
      success: true,
      message: result.message,
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const result = await authService.getCurrentUser(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
