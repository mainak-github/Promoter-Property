const { Faqs } = require('../../../models');

// Get all active FAQs
exports.getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faqs.findAll({ where: { isActive: true } });
    res.status(200).json({ success: true, faqs:faqs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create a new FAQ
exports.createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const faq = await Faqs.create({ question, answer });
    res.status(201).json({ success: true, faq });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
    console.log(err);
    
  }
};

// Update FAQ
exports.updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, isActive } = req.body;
    const updated = await Faqs.update({ question, answer, isActive }, { where: { id } });
    res.status(200).json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete FAQ
exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    await Faqs.destroy({ where: { id } });
    res.status(200).json({ success: true, message: 'FAQ deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
