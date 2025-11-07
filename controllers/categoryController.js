const categoryService = require("../services/categoryService");
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const result = await categoryService.createCategory(name, req.user._id);

    res.status(201).json({
      success: true,
      message: result.message,
      data: result.category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const result = await categoryService.updateCategory(id, name, req.user._id);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
