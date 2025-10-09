const { TermsAndConditions } = require('../../../models');

// GET all terms (for admin or public)
exports.getAllTerms = async (req, res) => {
  try {
    const terms = await TermsAndConditions.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json({ success: true, terms:terms });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch terms', error: err.message });
  }
};

// GET single active/latest terms (for public display)
exports.getActiveTerms = async (req, res) => {
  try {
    const terms = await TermsAndConditions.findOne({
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, terms:terms });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch active terms', error: err.message });
  }
};

// POST create new terms
exports.createTerms = async (req, res) => {
  try {
    const { title, content, isActive } = req.body;

    if (isActive) {
      await TermsAndConditions.update({ isActive: false }, { where: {} }); // deactivate all
    }

    const newTerms = await TermsAndConditions.create({ title, content, isActive });
    res.status(201).json({ success: true, terms: newTerms });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create terms', error: err.message });
  }
};

// PUT update existing terms
exports.updateTerms = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, isActive } = req.body;

    if (isActive) {
      await TermsAndConditions.update({ isActive: false }, { where: {} }); // deactivate all
    }

    const updated = await TermsAndConditions.update(
      { title, content, isActive },
      { where: { id } }
    );

    res.status(200).json({ success: true, message: 'Terms updated', updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update terms', error: err.message });
  }
};

// DELETE terms
exports.deleteTerms = async (req, res) => {
  try {
    const { id } = req.params;
    await TermsAndConditions.destroy({ where: { id } });
    res.status(200).json({ success: true, message: 'Terms deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete terms', error: err.message });
  }
};
