const Category = require('../models/Category');
const { successMessages, errorMessages } = require('../constants/common');
const mongoose = require('mongoose');
const { ConflictError, NotFoundError } = require('../utils/apiError');
exports.createCategory = async (name, createdBy) => {
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw new ConflictError(errorMessages.CATEGORY_ALREADY_EXIST);
  }

  const category = await Category.create({
    name,
    createdBy
  });

  return {
    category,
    message: successMessages.CATEGORY_SUCCESS
  };
};

exports.updateCategory = async (id, name, modifiedBy) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new NotFoundError(errorMessages.CATEGORY_NOT_FOUND);
  }
  const category = await Category.findById(id);
  if (!category) {
    throw new NotFoundError(errorMessages.CATEGORY_NOT_FOUND);
  }

  if (name) category.name = name;
  category.modifiedBy = modifiedBy;

  await category.save();

  return {
    category,
    message: successMessages.CATEGORY_UPDATE_SUCCESS
  };
};
exports.getCategoryById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new NotFoundError(errorMessages.CATEGORY_NOT_FOUND);
  }
  const category = await Category.findById(id);
  if (!category) {
    throw new NotFoundError(errorMessages.CATEGORY_NOT_FOUND);
  }
  return category;
};

exports.getAllCategories = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

  if (query.isActive === 'true') filter.isActive = true;
  else if (query.isActive === 'false') filter.isActive = false;

  if (query.search) {
    filter.name = { $regex: query.search, $options: 'i' };
  }

  const [categories, total] = await Promise.all([
    Category.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Category.countDocuments(filter)
  ]);

  return {
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalRecords: total,
    data: categories
  };
};
exports.toggleCategoryStatus = async (id, userId, isActive) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new NotFoundError(errorMessages.CATEGORY_NOT_FOUND);
  }
  const category = await Category.findByIdAndUpdate(
    id,
    { isActive: isActive, modifiedBy: userId, updatedAt: new Date() },
    { new: true }
  );

  if (!category) {
    throw new NotFoundError(errorMessages.CATEGORY_NOT_FOUND);
  }
  return category;
};
exports.getActiveCategories = async () => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 }).select('name');
  return categories;
};
