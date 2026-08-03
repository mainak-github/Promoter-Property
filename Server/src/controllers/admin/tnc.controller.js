const db = require('../../config/db');

// GET all terms
exports.getAllTerms = async (req, res) => {
  try {
    const [terms] = await db.query('SELECT * FROM TermsAndConditions ORDER BY createdAt DESC');
    res.status(200).json({ success: true, terms });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch terms', error: err.message });
  }
};

// GET single active/latest terms
exports.getActiveTerms = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM TermsAndConditions WHERE isActive = 1 ORDER BY createdAt DESC LIMIT 1');
    res.status(200).json({ success: true, terms: rows[0] || null });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch active terms', error: err.message });
  }
};

// POST create new terms
exports.createTerms = async (req, res) => {
  try {
    const { title, content, isActive } = req.body;
    const activeVal = isActive ? 1 : 0;

    if (activeVal === 1) {
      await db.query('UPDATE TermsAndConditions SET isActive = 0');
    }

    const [result] = await db.query(
      'INSERT INTO TermsAndConditions (title, content, isActive) VALUES (?, ?, ?)',
      [title, content, activeVal]
    );

    const [rows] = await db.query('SELECT * FROM TermsAndConditions WHERE id = ?', [result.insertId]);

    res.status(201).json({ success: true, terms: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create terms', error: err.message });
  }
};

// PUT update existing terms
exports.updateTerms = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, isActive } = req.body;
    const activeVal = isActive ? 1 : 0;

    if (activeVal === 1) {
      await db.query('UPDATE TermsAndConditions SET isActive = 0');
    }

    const [result] = await db.query(
      'UPDATE TermsAndConditions SET title = ?, content = ?, isActive = ? WHERE id = ?',
      [title, content, activeVal, id]
    );

    res.status(200).json({ success: true, message: 'Terms updated', updated: result.affectedRows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update terms', error: err.message });
  }
};

// DELETE terms
exports.deleteTerms = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM TermsAndConditions WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Terms deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete terms', error: err.message });
  }
};
