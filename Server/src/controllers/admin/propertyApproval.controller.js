// controllers/admin/propertyApproval.controller.js
const { Property } = require('../../../models');

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
    const property = await Property.findByPk(id);
    if (!property) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found'
      });
    }

    property.approvalStatus = approvalStatus;

    // Optional: only set remarks if your model and DB has this column
    if ('remarks' in property && remarks !== undefined) {
      property.remarks = remarks;
    }

    await property.save();

    return res.status(200).json({
      status: 'success',
      message: `Property has been ${approvalStatus}`,
      data: property
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update property approval status',
      error: error.message
    });
  }
};
