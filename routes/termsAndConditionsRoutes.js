const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const termsAndConditionsController = require('../controllers/termsAndConditionsController');

// Create or Update Terms and Conditions
router.post('/create-or-update', [
  body('heading').notEmpty().withMessage('Heading is required'),
  body('text').notEmpty().withMessage('Text is required')
], termsAndConditionsController.createOrUpdateTermsAndConditions);

// Get All Terms and Conditions
router.get('/', termsAndConditionsController.getTermsAndConditions);

// Get Terms and Conditions by ID
router.get('/:id', termsAndConditionsController.getTermsAndConditionsById);

// Delete Terms and Conditions
router.delete('/:id', termsAndConditionsController.deleteTermsAndConditions);

module.exports = router;