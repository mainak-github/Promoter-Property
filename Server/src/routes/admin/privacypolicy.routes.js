const express = require('express');
const router = express.Router();
const privacyPolicyController = require('../../controllers/admin/privacypolicy.controller');

// Create
router.post('/privacypolicies', privacyPolicyController.createPrivacyPolicies);

// Read all
router.get('/privacypolicies', privacyPolicyController.getAllPrivacyPolicies);

// Update
router.put('/privacypolicies/:id', privacyPolicyController.updatePrivacyPolicies);

// Delete
router.delete('/privacypolicies/:id', privacyPolicyController.deletePrivacyPolicies);

module.exports = router;
