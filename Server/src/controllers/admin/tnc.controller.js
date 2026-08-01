const { query } = require('../../config/db');

// GET all terms
exports.getAllTerms = async (req, res) => {
  try {
    const terms = await query('SELECT * FROM TermsAndConditions ORDER BY createdAt DESC');
    res.status(200).json({ success: true, terms });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch terms', error: err.message });
  }
};

// GET single active/latest terms
exports.getActiveTerms = async (req, res) => {
  try {
    const terms = await query('SELECT * FROM TermsAndConditions WHERE isActive = true ORDER BY createdAt DESC LIMIT 1');
    res.status(200).json({ success: true, terms: terms[0] || null });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch active terms', error: err.message });
  }
};

// POST create new terms
exports.createTerms = async (req, res) => {
  try {
    const { title, content, isActive } = req.body;

    if (isActive) {
      await query('UPDATE TermsAndConditions SET isActive = false');
    }

    const result = await query(
      'INSERT INTO TermsAndConditions (title, content, isActive, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
      [title, content, isActive ? true : false]
    );

    const newTerms = { id: result.insertId, title, content, isActive: Boolean(isActive) };
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
      await query('UPDATE TermsAndConditions SET isActive = false');
    }

    const updates = [];
    const params = [];

    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }
    if (content !== undefined) {
      updates.push('content = ?');
      params.push(content);
    }
    if (isActive !== undefined) {
      updates.push('isActive = ?');
      params.push(isActive);
    }

    if (updates.length > 0) {
      updates.push('updatedAt = NOW()');
      params.push(id);
      await query(`UPDATE TermsAndConditions SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    res.status(200).json({ success: true, message: 'Terms updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update terms', error: err.message });
  }
};

// DELETE terms
exports.deleteTerms = async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM TermsAndConditions WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Terms deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete terms', error: err.message });
  }
};
