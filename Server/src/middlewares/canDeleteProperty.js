const db = require('../config/db');

module.exports = async (req, res, next) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM Properties WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Property not found' });
    }

    const property = rows[0];

    // Admins can delete any, brokers can delete their own
    if (req.user?.role === 'admin' || (req.user?.role === 'broker' && property.brokerId === req.user.id)) {
      req.propertyToDelete = property;
      return next();
    }

    return res.status(403).json({ status: 'error', message: 'Unauthorized to delete this property' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Error validating property', error: error.message });
  }
};
