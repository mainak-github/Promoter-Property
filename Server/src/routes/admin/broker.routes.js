const express = require('express');
const router = express.Router();
const brokerController = require('../../controllers/admin/broker.controller');
const { verifyToken, allowRoles } = require('../../middlewares/auth.middleware');
const upload = require('../../utils/multer');

// router.use(verifyToken, allowRoles('admin'));

router.post(
  '/',
  upload.fields([
    { name: 'agreementFile', maxCount: 1 },
    { name: 'profilePhoto', maxCount: 1 }
  ]),
  brokerController.createBroker
);

// List all brokers
router.get('/allbrokers', brokerController.listBrokers);

// List all brokers
router.get('/:id/broker', brokerController.brokerDetails);

// Update broker
router.put(
  '/:id',
  upload.fields([
    { name: 'agreementFile', maxCount: 1 },
    { name: 'profilePhoto', maxCount: 1 }
  ]),
  brokerController.updateBroker
);

// Deactivate broker
router.put('/:id/deactivate', brokerController.deactivateBroker);
router.delete('/:userId', brokerController.deleteBroker);

//approve broker
router.put('/:id/approveBroker', brokerController.approveBroker); 
router.put('/:id/rejectBroker', brokerController.rejectBroker); 


module.exports = router;
