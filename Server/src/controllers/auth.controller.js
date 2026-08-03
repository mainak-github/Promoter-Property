const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const [existingRows] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (existingRows.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || 'client';

    const [result] = await db.query(
      'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, userRole]
    );

    const [userRows] = await db.query(
      'SELECT id, name, email, role, createdAt, updatedAt FROM Users WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({ message: 'User registered', user: userRows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password before sending user object
    delete user.password;

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.listusers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email, role, createdAt, updatedAt FROM Users WHERE role = 'client'"
    );
    console.log('Users fetched successfully', users);
    res.status(200).json({ message: 'Users fetched successfully', users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.userDetails = async (req, res) => {
  try {
    const [UserDetails] = await db.query(
      'SELECT id, name, email, role, createdAt, updatedAt FROM Users WHERE id = ?',
      [req.params.id]
    );

    if (!UserDetails || UserDetails.length === 0) {
      return res.status(404).json({ message: 'UserDetails not found' });
    }

    console.log('UserDetails fetched successfully', UserDetails);
    res.status(200).json({ message: 'UserDetails fetched successfully', UserDetails });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch User' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const [userRows] = await db.query('SELECT id FROM Users WHERE id = ?', [id]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    await db.query('DELETE FROM Users WHERE id = ?', [id]);

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, name, email, role, ...otherData } = req.body;

    const updateFields = [];
    const values = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      values.push(name);
    }
    if (email !== undefined) {
      updateFields.push('email = ?');
      values.push(email);
    }
    if (role !== undefined) {
      updateFields.push('role = ?');
      values.push(role);
    }
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push('password = ?');
      values.push(hashedPassword);
    }

    for (const [key, val] of Object.entries(otherData)) {
      updateFields.push(`${key} = ?`);
      values.push(val);
    }

    if (updateFields.length === 0) {
      const [currentUser] = await db.query(
        'SELECT id, name, email, role, createdAt, updatedAt FROM Users WHERE id = ?',
        [id]
      );
      return res.status(200).json({ message: 'No fields to update', user: currentUser[0] });
    }

    values.push(id);
    const [result] = await db.query(
      `UPDATE Users SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows > 0) {
      const [updatedUser] = await db.query(
        'SELECT id, name, email, role, createdAt, updatedAt FROM Users WHERE id = ?',
        [id]
      );
      return res.status(200).json({ message: 'User updated successfully', user: updatedUser[0] });
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};
