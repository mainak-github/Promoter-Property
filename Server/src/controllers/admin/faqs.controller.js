const db = require('../../config/db');

// Get all active FAQs
exports.getAllFaqs = async (req, res) => {
  try {
    const [faqs] = await db.query('SELECT * FROM Faqs WHERE isActive = 1');
    res.status(200).json({ success: true, faqs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create a new FAQ
exports.createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const [result] = await db.query('INSERT INTO Faqs (question, answer) VALUES (?, ?)', [question, answer]);
    const [rows] = await db.query('SELECT * FROM Faqs WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, faq: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update FAQ
exports.updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, isActive } = req.body;
    const [result] = await db.query(
      'UPDATE Faqs SET question = ?, answer = ?, isActive = ? WHERE id = ?',
      [question, answer, isActive !== undefined ? (isActive ? 1 : 0) : 1, id]
    );
    res.status(200).json({ success: true, updated: result.affectedRows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete FAQ
exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM Faqs WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'FAQ deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
