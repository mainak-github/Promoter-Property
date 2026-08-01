const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey123';

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUsers = await query('SELECT * FROM Users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || 'client';

    const result = await query(
      'INSERT INTO Users (name, email, password, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [name, email, hashedPassword, userRole]
    );

    const newUser = {
      id: result.insertId,
      name,
      email,
      role: userRole
    };

    res.status(201).json({ message: 'User registered', user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = await query('SELECT * FROM Users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    delete user.password;
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.listusers = async (req, res) => {
  try {
    const users = await query("SELECT id, name, email, role, createdAt, updatedAt FROM Users WHERE role = 'client'");
    res.status(200).json({ message: 'Users fetched successfully', users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.userDetails = async (req, res) => {
  try {
    const users = await query('SELECT id, name, email, role, createdAt, updatedAt FROM Users WHERE id = ?', [req.params.id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'UserDetails not found' });
    }
    res.status(200).json({ message: 'UserDetails fetched successfully', UserDetails: users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch User' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const users = await query('SELECT id FROM Users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    await query('DELETE FROM Users WHERE id = ?', [id]);
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, name, email, role } = req.body;

    const users = await query('SELECT * FROM Users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      params.push(email);
    }
    if (role !== undefined) {
      updates.push('role = ?');
      params.push(role);
    }
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push('password = ?');
      params.push(hashedPassword);
    }

    if (updates.length > 0) {
      updates.push('updatedAt = NOW()');
      params.push(id);
      await query(`UPDATE Users SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    const updatedUsers = await query('SELECT id, name, email, role, createdAt, updatedAt FROM Users WHERE id = ?', [id]);
    return res.status(200).json({ message: 'User updated successfully', user: updatedUsers[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};
