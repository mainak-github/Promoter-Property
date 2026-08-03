const express = require('express');
const router = express.Router();
const termsController = require('../../controllers/admin/tnc.controller');

// Public
router.get('/tnc', termsController.getAllTerms);
router.get('/tnc/active', termsController.getActiveTerms);

// Admin
router.post('/tnc', termsController.createTerms);
router.put('/tnc/:id', termsController.updateTerms);
router.delete('/tnc/:id', termsController.deleteTerms);

module.exports = router;
