
const express = require('express');
const router = express.Router();
const brokerPropertyController = require('../../controllers/broker/propertyController');
const { verifyToken } = require('../../middlewares/auth.middleware');
const isBroker = require('../../middlewares/isBroker');
const upload = require('../../middlewares/multer'); 

router.post(
  '/createproperty',
  verifyToken,
  upload.fields([
    { name: 'coverPhoto', maxCount: 1 },
    { name: 'additionalPhotos', maxCount: 20 },
    { name: 'floorPlans', maxCount: 20 },
    { name: 'developerLogo', maxCount: 1 },
    { name: 'layoutMaps', maxCount: 20 }
  ]),
  brokerPropertyController.createProperty
);


// List all properties
router.get('/allproperties', brokerPropertyController.listProperties);

// list properties by broker
router.get('/myproperties/:id', brokerPropertyController.listBrokerProperties);

// Get property details
router.get('/propertydetails/:id', brokerPropertyController.getPropertyDetails);

module.exports = router;