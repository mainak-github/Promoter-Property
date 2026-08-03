const db = require('../../config/db');

exports.createPrivacyPolicies = async (req, res) => {
  try {
    const { title, content } = req.body;
    const [result] = await db.query('INSERT INTO PrivacyPolicies (title, content) VALUES (?, ?)', [title, content]);
    const [rows] = await db.query('SELECT * FROM PrivacyPolicies WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, policy: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllPrivacyPolicies = async (req, res) => {
  try {
    const [policies] = await db.query('SELECT * FROM PrivacyPolicies ORDER BY createdAt DESC');
    res.status(200).json({ success: true, policies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updatePrivacyPolicies = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, isActive } = req.body;

    const [rows] = await db.query('SELECT * FROM PrivacyPolicies WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Policy not found' });

    await db.query(
      'UPDATE PrivacyPolicies SET title = ?, content = ?, isActive = ? WHERE id = ?',
      [
        title !== undefined ? title : rows[0].title,
        content !== undefined ? content : rows[0].content,
        isActive !== undefined ? (isActive ? 1 : 0) : rows[0].isActive,
        id
      ]
    );

    const [updatedRows] = await db.query('SELECT * FROM PrivacyPolicies WHERE id = ?', [id]);

    res.status(200).json({ success: true, policy: updatedRows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deletePrivacyPolicies = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM PrivacyPolicies WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Policy not found' });

    await db.query('DELETE FROM PrivacyPolicies WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
