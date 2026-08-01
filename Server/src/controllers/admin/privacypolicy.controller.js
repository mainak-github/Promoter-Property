const { query } = require('../../config/db');

exports.createPrivacyPolicies = async (req, res) => {
  try {
    const { title, content } = req.body;
    const result = await query(
      'INSERT INTO PrivacyPolicies (title, content, isActive, createdAt, updatedAt) VALUES (?, ?, true, NOW(), NOW())',
      [title, content]
    );
    const policy = { id: result.insertId, title, content, isActive: true };
    res.status(201).json({ success: true, policy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllPrivacyPolicies = async (req, res) => {
  try {
    const policies = await query('SELECT * FROM PrivacyPolicies ORDER BY createdAt DESC');
    res.status(200).json({ success: true, policies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updatePrivacyPolicies = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, isActive } = req.body;

    const policies = await query('SELECT * FROM PrivacyPolicies WHERE id = ?', [id]);
    if (policies.length === 0) {
      return res.status(404).json({ success: false, message: 'Policy not found' });
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
      await query(`UPDATE PrivacyPolicies SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    const updatedPolicy = await query('SELECT * FROM PrivacyPolicies WHERE id = ?', [id]);
    res.status(200).json({ success: true, policy: updatedPolicy[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deletePrivacyPolicies = async (req, res) => {
  try {
    const { id } = req.params;
    const policies = await query('SELECT * FROM PrivacyPolicies WHERE id = ?', [id]);
    if (policies.length === 0) {
      return res.status(404).json({ success: false, message: 'Policy not found' });
    }

    await query('DELETE FROM PrivacyPolicies WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
