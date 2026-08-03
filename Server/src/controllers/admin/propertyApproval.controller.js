const db = require('../../config/db');

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
    const [rows] = await db.query('SELECT * FROM Properties WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found'
      });
    }

    if (remarks !== undefined) {
      await db.query('UPDATE Properties SET approvalStatus = ?, remarks = ? WHERE id = ?', [approvalStatus, remarks, id]);
    } else {
      await db.query('UPDATE Properties SET approvalStatus = ? WHERE id = ?', [approvalStatus, id]);
    }

    const [updatedRows] = await db.query('SELECT * FROM Properties WHERE id = ?', [id]);

    return res.status(200).json({
      status: 'success',
      message: `Property has been ${approvalStatus}`,
      data: updatedRows[0]
    });
  } catch (error) {
    console.error('Error approving/rejecting property:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update property approval status',
      error: error.message
    });
  }
};
