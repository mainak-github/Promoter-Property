
// routes/admin/property.routes.js
const express = require('express');
const router = express.Router();
const { verifyToken, allowRoles } = require('../../middlewares/auth.middleware');
const { approveOrRejectProperty } = require('../../controllers/admin/propertyApproval.controller');
const adminPropertyController = require('../../controllers/admin/property.controller')
const { canDeleteProperty } = require('../../middlewares/canDeleteProperty');
const upload = require('../../middlewares/multer');

router.put(
  '/properties/:id/approval',
  verifyToken,
  allowRoles('admin', 'super_admin'),
  approveOrRejectProperty
);

router.get('/properties', verifyToken, allowRoles('admin'), adminPropertyController.getAllProperties);

router.put(
  '/properties/:id',
  verifyToken,
  allowRoles('admin', 'broker'),
  upload.fields([
    { name: 'coverPhoto', maxCount: 1 },
    { name: 'additionalPhotos', maxCount: 20 },
    { name: 'floorPlans', maxCount: 20 },
    { name: 'developerLogo', maxCount: 1 },
    { name: 'layoutMaps', maxCount: 20 }
  ]),
  adminPropertyController.updateProperty
);


router.delete('/properties/delete/:id', verifyToken, adminPropertyController.deleteProperty);



module.exports = router;
