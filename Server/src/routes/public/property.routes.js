
const express = require('express');
const router = express.Router();
const publicPropertyController = require('../../controllers/public/property.controller');
const { getSingleProperty } = require('../../controllers/public/property.controller');
const statsController = require('../../controllers/public/stats.controller');

router.get('/properties', publicPropertyController.getApprovedProperties);
router.get('/properties/:id', getSingleProperty);
router.get('/stats', statsController.getStats);

module.exports = router;
