const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/landingPage.controller');

// Admin landing page CRUD
router.get('/landing-pages', controller.getAllLandingPages);
router.get('/landing-pages/:id', controller.getLandingPageById);
router.post('/landing-pages', controller.createLandingPage);
router.put('/landing-pages/:id', controller.updateLandingPage);
router.delete('/landing-pages/:id', controller.deleteLandingPage);
router.post('/landing-pages/:id/duplicate', controller.duplicateLandingPage);

module.exports = router;
