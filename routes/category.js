const express = require('express');
const router = express.Router();
const { validateRequest } = require('../middleware/validation');
const { createCategorySchema, updateCategorySchema } = require('../validations/categoryValidation');
const { protect } = require('../middleware/auth');
const categoryController = require('../controllers/categoryController');

router.post('/', protect, validateRequest(createCategorySchema), categoryController.createCategory);
router.put(
  '/:id',
  protect,
  validateRequest(updateCategorySchema),
  categoryController.updateCategory
);
router.get('/:id', protect, categoryController.getCategoryById);

module.exports = router;
