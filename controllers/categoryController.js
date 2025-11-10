const { successMessages } = require('../constants/common');
const categoryService = require('../services/categoryService');
exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    const result = await categoryService.createCategory(name, req.user._id);

    res.status(201).json({
      success: true,
      message: result.message,
      data: result.category
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const result = await categoryService.updateCategory(id, name, req.user._id);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.category
    });
  } catch (error) {
    next(error);
  }
};
exports.getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories(req.query);
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};
exports.toggleCategoryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isActive = req.body.isActive;
    const result = await categoryService.toggleCategoryStatus(id, req.user._id, isActive);
    res.status(200).json({
      success: true,
      message: successMessages.CATEGORY_STATUS_TOGGLE_SUCCESS,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
exports.getActiveCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getActiveCategories();
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};
