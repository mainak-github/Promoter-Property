const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const db = require('../../config/db');

exports.createBroker = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const {
      name,
      email,
      password,
      mobileNumber,
      companyName,
      companyRegNo,
      gstId,
      brokerRegNo,
      address,
      memberId,
      approval_status,
      created_by
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 1: Create user
    const [userResult] = await connection.query(
      'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'broker']
    );

    const userId = userResult.insertId;

    // Safe name for folder
    const safeName = name.replace(/\s+/g, '_') + `_${userId}`;
    const brokerFolderPath = path.join('uploads', 'brokers', safeName);

    // Ensure directory exists
    fs.mkdirSync(brokerFolderPath, { recursive: true });

    // Move files to broker folder and set paths
    let agreementFilePath = null;
    let profilePhotoPath = null;

    if (req.files?.agreementFile?.[0]) {
      const file = req.files.agreementFile[0];
      const destPath = path.join(brokerFolderPath, file.originalname);
      fs.renameSync(file.path, destPath);
      agreementFilePath = destPath;
    }

    if (req.files?.profilePhoto?.[0]) {
      const file = req.files.profilePhoto[0];
      const destPath = path.join(brokerFolderPath, file.originalname);
      fs.renameSync(file.path, destPath);
      profilePhotoPath = destPath;
    }

    const status = ['pending', 'approved', 'rejected'].includes(approval_status) ? approval_status : 'pending';

    // Step 2: Create broker profile
    const [profileResult] = await connection.query(
      `INSERT INTO BrokerProfiles (
        userId, fullName, mobileNumber, companyName, companyRegNo, gstId,
        brokerRegNo, agreementFile, address, profilePhoto, memberId,
        approval_status, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        name,
        mobileNumber || null,
        companyName || null,
        companyRegNo || null,
        gstId || null,
        brokerRegNo || null,
        agreementFilePath,
        address || null,
        profilePhotoPath,
        memberId || null,
        status,
        created_by || null
      ]
    );

    await connection.commit();

    const [userRows] = await db.query(
      'SELECT id, name, email, role, createdAt, updatedAt FROM Users WHERE id = ?',
      [userId]
    );
    const [profileRows] = await db.query(
      'SELECT * FROM BrokerProfiles WHERE id = ?',
      [profileResult.insertId]
    );

    return res.status(201).json({ user: userRows[0], brokerProfile: profileRows[0] });
  } catch (err) {
    await connection.rollback();
    console.error('Error creating broker:', err);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
};

exports.listBrokers = async (req, res) => {
  try {
    const [brokers] = await db.query('SELECT * FROM BrokerProfiles ORDER BY createdAt DESC');
    console.log('Brokers fetched successfully', brokers);
    res.status(200).json({ message: 'Brokers fetched successfully', brokers });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch brokers' });
  }
};

exports.brokerDetails = async (req, res) => {
  try {
    const [broker] = await db.query('SELECT * FROM BrokerProfiles WHERE id = ?', [req.params.id]);
    if (!broker || broker.length === 0) {
      return res.status(404).json({ message: 'Broker not found' });
    }
    console.log('Broker fetched successfully', broker);
    res.status(200).json({ message: 'Broker fetched successfully', broker });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch broker' });
  }
};

exports.deactivateBroker = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await db.query("SELECT * FROM Users WHERE id = ? AND role = 'broker'", [id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'Broker not found' });
    }

    // If active column exists in users table, update it
    await db.query('UPDATE Users SET updatedAt = NOW() WHERE id = ?', [id]);

    res.json({ message: 'Broker deactivated' });
  } catch (err) {
    res.status(500).json({ error: 'Could not deactivate broker' });
  }
};

exports.updateBroker = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      fullName,
      mobileNumber,
      companyName,
      companyRegNo,
      gstId,
      brokerRegNo,
      address,
      memberId,
    } = req.body;

    // Step 1: Fetch existing broker profile
    const [brokerRows] = await db.query('SELECT * FROM BrokerProfiles WHERE id = ?', [id]);
    if (brokerRows.length === 0) return res.status(404).json({ error: 'Broker not found' });

    const broker = brokerRows[0];

    // Update User name if applicable
    if (fullName) {
      await db.query('UPDATE Users SET name = ? WHERE id = ?', [fullName, broker.userId]);
    }

    // Build safe folder name
    const nameForFolder = fullName || broker.fullName || 'broker';
    const safeName = nameForFolder.replace(/\s+/g, '_') + `_${id}`;
    const brokerFolderPath = path.join('uploads', 'brokers', safeName);
    fs.mkdirSync(brokerFolderPath, { recursive: true });

    let agreementFilePath = broker.agreementFile;
    let profilePhotoPath = broker.profilePhoto;

    // Replace agreementFile if uploaded
    if (req.files?.agreementFile?.[0]) {
      if (agreementFilePath && fs.existsSync(agreementFilePath)) {
        fs.unlinkSync(agreementFilePath);
      }
      const newFile = req.files.agreementFile[0];
      const newPath = path.join(brokerFolderPath, newFile.originalname);
      fs.renameSync(newFile.path, newPath);
      agreementFilePath = newPath;
    }

    // Replace profilePhoto if uploaded
    if (req.files?.profilePhoto?.[0]) {
      if (profilePhotoPath && fs.existsSync(profilePhotoPath)) {
        fs.unlinkSync(profilePhotoPath);
      }
      const newFile = req.files.profilePhoto[0];
      const newPath = path.join(brokerFolderPath, newFile.originalname);
      fs.renameSync(newFile.path, newPath);
      profilePhotoPath = newPath;
    }

    // Step 2: Update BrokerProfile
    await db.query(
      `UPDATE BrokerProfiles SET
        fullName = ?,
        mobileNumber = ?,
        companyName = ?,
        companyRegNo = ?,
        gstId = ?,
        brokerRegNo = ?,
        address = ?,
        memberId = ?,
        agreementFile = ?,
        profilePhoto = ?
      WHERE id = ?`,
      [
        fullName || broker.fullName,
        mobileNumber !== undefined ? mobileNumber : broker.mobileNumber,
        companyName !== undefined ? companyName : broker.companyName,
        companyRegNo !== undefined ? companyRegNo : broker.companyRegNo,
        gstId !== undefined ? gstId : broker.gstId,
        brokerRegNo !== undefined ? brokerRegNo : broker.brokerRegNo,
        address !== undefined ? address : broker.address,
        memberId !== undefined ? memberId : broker.memberId,
        agreementFilePath,
        profilePhotoPath,
        id
      ]
    );

    return res.status(200).json({ message: 'Broker updated successfully' });
  } catch (err) {
    console.error('Error updating broker:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteBroker = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const userId = req.params.userId;

    const [brokerRows] = await connection.query('SELECT * FROM BrokerProfiles WHERE userId = ?', [userId]);
    if (brokerRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Broker profile not found' });
    }

    const [userRows] = await connection.query("SELECT * FROM Users WHERE id = ? AND role = 'broker'", [userId]);
    if (userRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Broker user not found' });
    }

    const user = userRows[0];
    const safeName = (user.name || 'broker').replace(/\s+/g, '_') + `_${userId}`;
    const brokerFolder = path.join('uploads', 'brokers', safeName);

    if (fs.existsSync(brokerFolder)) {
      fs.rmSync(brokerFolder, { recursive: true, force: true });
    }

    await connection.query('DELETE FROM BrokerProfiles WHERE userId = ?', [userId]);
    await connection.query('DELETE FROM Users WHERE id = ?', [userId]);

    await connection.commit();

    return res.status(200).json({ message: 'Broker deleted successfully' });
  } catch (err) {
    await connection.rollback();
    console.error('Error deleting broker:', err);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
};

exports.approveBroker = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query('SELECT * FROM BrokerProfiles WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Broker not found' });
    }

    await db.query("UPDATE BrokerProfiles SET approval_status = 'approved' WHERE id = ?", [id]);

    const [updatedRows] = await db.query('SELECT * FROM BrokerProfiles WHERE id = ?', [id]);

    return res.status(200).json({
      message: 'Broker approved successfully',
      broker: updatedRows[0],
    });
  } catch (error) {
    console.error('Error approving broker:', error);
    return res.status(500).json({ message: 'Server error while approving broker' });
  }
};

exports.rejectBroker = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query('SELECT * FROM BrokerProfiles WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Broker not found' });
    }

    await db.query("UPDATE BrokerProfiles SET approval_status = 'rejected' WHERE id = ?", [id]);

    const [updatedRows] = await db.query('SELECT * FROM BrokerProfiles WHERE id = ?', [id]);

    return res.status(200).json({
      message: 'Broker rejected successfully',
      broker: updatedRows[0],
    });
  } catch (error) {
    console.error('Error rejecting broker:', error);
    return res.status(500).json({ message: 'Server error while rejecting broker' });
  }
};
