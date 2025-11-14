const express = require('express');
const router = express.Router();
const { validateRequest } = require('../middleware/validation');
const { createCategorySchema, updateCategorySchema } = require('../validations/categoryValidation');
const { protect, authorize } = require('../middleware/auth');
const categoryController = require('../controllers/categoryController');

router.post(
  '/',
  protect,
  validateRequest(createCategorySchema),
  authorize('admin'),
  categoryController.createCategory
);
router.put(
  '/:id',
  protect,
  authorize('admin'),
  validateRequest(updateCategorySchema),
  categoryController.updateCategory
);
router.get('/:id', protect, categoryController.getCategoryById);
router.get('/', categoryController.getAllCategories);
router.patch('/:id/status', protect, authorize('admin'), categoryController.toggleCategoryStatus);
router.get('/active/list', categoryController.getActiveCategories);
module.exports = router;
