const Category = require('../models/Category');
const { successMessages, errorMessages } = require('../constants/common');
const mongoose = require('mongoose');
exports.createCategory = async (name, createdBy) => {
  try {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      throw new Error(errorMessages.CATEGORY_ALREADY_EXIST);
    }

    const category = await Category.create({
      name,
      createdBy
    });

    return {
      category,
      message: successMessages.CATEGORY_SUCCESS
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateCategory = async (id, name, modifiedBy) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(errorMessages.CATEGORY_NOT_FOUND);
    }
    const category = await Category.findById(id);
    if (!category) {
      throw new Error(errorMessages.CATEGORY_NOT_FOUND);
    }

    if (name) category.name = name;
    category.modifiedBy = modifiedBy;

    await category.save();

    return {
      category,
      message: successMessages.CATEGORY_UPDATE_SUCCESS
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
exports.getCategoryById = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(errorMessages.CATEGORY_NOT_FOUND);
    }
    const category = await Category.findById(id);
    if (!category) {
      throw new Error(errorMessages.CATEGORY_NOT_FOUND);
    }
    return category;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
