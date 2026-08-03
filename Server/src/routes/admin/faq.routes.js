const express = require('express');
const router = express.Router();
const faqController = require('../../controllers/admin/faqs.controller');

router.get('/faqs', faqController.getAllFaqs);
router.post('/faqs', faqController.createFaq);
router.put('/faqs/:id', faqController.updateFaq);
router.delete('/faqs/:id', faqController.deleteFaq);

module.exports = router;
