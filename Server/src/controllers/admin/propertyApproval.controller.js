const { query } = require('../../config/db');

exports.approveOrRejectProperty = async (req, res) => {
  const { id } = req.params;
  const { approvalStatus, remarks } = req.body;

  if (!['approved', 'rejected'].includes(approvalStatus)) {
    return res.status(400).json({
      status: 'error',
      message: 'approvalStatus must be either "approved" or "rejected"'
    });
  }

  try {
    const properties = await query('SELECT * FROM Properties WHERE id = ?', [id]);
    if (properties.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found'
      });
    }

    if (remarks !== undefined) {
      await query('UPDATE Properties SET approvalStatus = ?, remarks = ?, updatedAt = NOW() WHERE id = ?', [approvalStatus, remarks, id]);
    } else {
      await query('UPDATE Properties SET approvalStatus = ?, updatedAt = NOW() WHERE id = ?', [approvalStatus, id]);
    }

    const updatedProperty = await query('SELECT * FROM Properties WHERE id = ?', [id]);

    return res.status(200).json({
      status: 'success',
      message: `Property has been ${approvalStatus}`,
      data: updatedProperty[0]
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update property approval status',
      error: error.message
    });
  }
};
