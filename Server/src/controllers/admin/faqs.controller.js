const { query } = require('../../config/db');

exports.getAllFaqs = async (req, res) => {
  try {
    const faqs = await query('SELECT * FROM Faqs WHERE isActive = true');
    res.status(200).json({ success: true, faqs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const result = await query(
      'INSERT INTO Faqs (question, answer, isActive, createdAt, updatedAt) VALUES (?, ?, true, NOW(), NOW())',
      [question, answer]
    );
    const faq = { id: result.insertId, question, answer, isActive: true };
    res.status(201).json({ success: true, faq });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, isActive } = req.body;

    const updates = [];
    const params = [];

    if (question !== undefined) {
      updates.push('question = ?');
      params.push(question);
    }
    if (answer !== undefined) {
      updates.push('answer = ?');
      params.push(answer);
    }
    if (isActive !== undefined) {
      updates.push('isActive = ?');
      params.push(isActive);
    }

    if (updates.length > 0) {
      updates.push('updatedAt = NOW()');
      params.push(id);
      await query(`UPDATE Faqs SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    res.status(200).json({ success: true, message: 'FAQ updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM Faqs WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'FAQ deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
