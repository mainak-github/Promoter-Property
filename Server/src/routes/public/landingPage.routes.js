const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/landingPage.controller');

// Public landing page view and lead submission
router.get('/landing-pages/:slug', controller.getPublicLandingPageBySlug);
router.post('/landing-leads', controller.submitLandingPageLead);

module.exports = router;
