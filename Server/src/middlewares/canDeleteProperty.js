// middleware/canDeleteProperty.js
const { Property } = require('../../models');

module.exports = async (req, res, next) => {
  const { id } = req.params;

  try {
    const property = await Property.findByPk(id);
    if (!property) {
      return res.status(404).json({ status: 'error', message: 'Property not found' });
    }

    // Admins can delete any, brokers can delete their own
    if (req.user.role === 'admin' || (req.user.role === 'broker' && property.brokerId === req.user.id)) {
      req.propertyToDelete = property; // attach to req for next step
      return next();
    }

    return res.status(403).json({ status: 'error', message: 'Unauthorized to delete this property' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Error validating property', error: error.message });
  }
};
