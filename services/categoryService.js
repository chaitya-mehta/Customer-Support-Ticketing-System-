const Category = require("../models/Category");
const { successMessages, errorMessages } = require("../constants/common");

exports.createCategory = async (name, createdBy) => {
  try {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      throw new Error(
        errorMessages.ALREADY_EXISTS || "Category already exists"
      );
    }

    const category = await Category.create({
      name,
      createdBy,
    });

    return {
      category,
      message:
        successMessages.CREATE_SUCCESS || "Category created successfully",
    };
  } catch (error) {
    throw error;
  }
};

exports.updateCategory = async (id, name, modifiedBy) => {
  try {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error(errorMessages.NOT_FOUND || "Category not found");
    }

    if (name) category.name = name;
    category.modifiedBy = modifiedBy;

    await category.save();

    return {
      category,
      message:
        successMessages.UPDATE_SUCCESS || "Category updated successfully",
    };
  } catch (error) {
    throw error;
  }
};
