const { PrivacyPolicies } = require('../../../models');

exports.createPrivacyPolicies = async (req, res) => {
  try {
    const { title, content } = req.body;
    const policy = await PrivacyPolicies.create({ title, content });
    res.status(201).json({ success: true, policy:policy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
    console.log(err)
  }
};

exports.getAllPrivacyPolicies = async (req, res) => {
  try {
    const policies = await PrivacyPolicies.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json({ success: true, policies:policies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updatePrivacyPolicies = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, isActive } = req.body;

    const policy = await PrivacyPolicies.findByPk(id);
    if (!policy) return res.status(404).json({ success: false, message: 'Policy not found' });

    await policy.update({ title, content, isActive });
    res.status(200).json({ success: true, policy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deletePrivacyPolicies = async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await PrivacyPolicies.findByPk(id);
    if (!policy) return res.status(404).json({ success: false, message: 'Policy not found' });

    await policy.destroy();
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
    console.log(err)
  }
};
