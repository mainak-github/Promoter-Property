const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const { query } = require('../../config/db');

exports.createBroker = async (req, res) => {
  try {
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
    const userResult = await query(
      'INSERT INTO Users (name, email, password, role, createdAt, updatedAt) VALUES (?, ?, ?, "broker", NOW(), NOW())',
      [name, email, hashedPassword]
    );
    const userId = userResult.insertId;

    // Folder for broker files
    const safeName = name.replace(/\s+/g, '_') + `_${userId}`;
    const brokerFolderPath = path.join('uploads', 'brokers', safeName);
    fs.mkdirSync(brokerFolderPath, { recursive: true });

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

    const validApprovalStatus = ['pending', 'approved', 'rejected'].includes(approval_status) ? approval_status : 'pending';

    // Step 2: Create broker profile
    const profileResult = await query(
      `INSERT INTO BrokerProfiles (
        userId, fullName, mobileNumber, companyName, companyRegNo, gstId, brokerRegNo,
        agreementFile, address, profilePhoto, memberId, approval_status, created_by, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        userId, name, mobileNumber || null, companyName || null, companyRegNo || null,
        gstId || null, brokerRegNo || null, agreementFilePath, address || null,
        profilePhotoPath, memberId || null, validApprovalStatus, created_by || null
      ]
    );

    const user = { id: userId, name, email, role: 'broker' };
    const brokerProfile = {
      id: profileResult.insertId,
      userId,
      fullName: name,
      mobileNumber,
      companyName,
      companyRegNo,
      gstId,
      brokerRegNo,
      agreementFile: agreementFilePath,
      address,
      profilePhoto: profilePhotoPath,
      memberId,
      approval_status: validApprovalStatus,
      created_by
    };

    return res.status(201).json({ user, brokerProfile });
  } catch (err) {
    console.error('Error creating broker:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.listBrokers = async (req, res) => {
  try {
    const brokers = await query('SELECT * FROM BrokerProfiles');
    res.status(200).json({ message: 'Brokers fetched successfully', brokers });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch brokers' });
  }
};

exports.brokerDetails = async (req, res) => {
  try {
    const broker = await query('SELECT * FROM BrokerProfiles WHERE id = ?', [req.params.id]);
    if (broker.length === 0) {
      return res.status(404).json({ message: 'Broker not found' });
    }
    res.status(200).json({ message: 'Broker fetched successfully', broker });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch broker' });
  }
};

exports.deactivateBroker = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await query("SELECT * FROM Users WHERE id = ? AND role = 'broker'", [id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'Broker not found' });
    }

    await query('UPDATE Users SET active = false, updatedAt = NOW() WHERE id = ?', [id]);
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
      memberId
    } = req.body;

    if (fullName) {
      await query('UPDATE Users SET name = ?, updatedAt = NOW() WHERE id = ?', [fullName, id]);
    }

    const brokers = await query('SELECT * FROM BrokerProfiles WHERE id = ?', [id]);
    if (brokers.length === 0) return res.status(404).json({ error: 'Broker not found' });

    const broker = brokers[0];
    const safeName = (fullName || broker.fullName || 'broker').replace(/\s+/g, '_') + `_${id}`;
    const brokerFolderPath = path.join('uploads', 'brokers', safeName);
    fs.mkdirSync(brokerFolderPath, { recursive: true });

    let agreementFilePath = broker.agreementFile;
    let profilePhotoPath = broker.profilePhoto;

    if (req.files?.agreementFile?.[0]) {
      if (agreementFilePath && fs.existsSync(agreementFilePath)) {
        fs.unlinkSync(agreementFilePath);
      }
      const newFile = req.files.agreementFile[0];
      const newPath = path.join(brokerFolderPath, newFile.originalname);
      fs.renameSync(newFile.path, newPath);
      agreementFilePath = newPath;
    }

    if (req.files?.profilePhoto?.[0]) {
      if (profilePhotoPath && fs.existsSync(profilePhotoPath)) {
        fs.unlinkSync(profilePhotoPath);
      }
      const newFile = req.files.profilePhoto[0];
      const newPath = path.join(brokerFolderPath, newFile.originalname);
      fs.renameSync(newFile.path, newPath);
      profilePhotoPath = newPath;
    }

    await query(
      `UPDATE BrokerProfiles SET
        fullName = COALESCE(?, fullName),
        mobileNumber = COALESCE(?, mobileNumber),
        companyName = COALESCE(?, companyName),
        companyRegNo = COALESCE(?, companyRegNo),
        gstId = COALESCE(?, gstId),
        brokerRegNo = COALESCE(?, brokerRegNo),
        address = COALESCE(?, address),
        memberId = COALESCE(?, memberId),
        agreementFile = ?,
        profilePhoto = ?,
        updatedAt = NOW()
      WHERE id = ?`,
      [fullName, mobileNumber, companyName, companyRegNo, gstId, brokerRegNo, address, memberId, agreementFilePath, profilePhotoPath, id]
    );

    return res.status(200).json({ message: 'Broker updated successfully' });
  } catch (err) {
    console.error('Error updating broker:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteBroker = async (req, res) => {
  try {
    const userId = req.params.userId;

    const brokers = await query('SELECT * FROM BrokerProfiles WHERE userId = ?', [userId]);
    if (brokers.length === 0) {
      return res.status(404).json({ error: 'Broker profile not found' });
    }

    const users = await query("SELECT * FROM Users WHERE id = ? AND role = 'broker'", [userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'Broker user not found' });
    }

    const user = users[0];
    const safeName = user.name.replace(/\s+/g, '_') + `_${userId}`;
    const brokerFolder = path.join('uploads', 'brokers', safeName);

    if (fs.existsSync(brokerFolder)) {
      fs.rmSync(brokerFolder, { recursive: true, force: true });
    }

    await query('DELETE FROM BrokerProfiles WHERE userId = ?', [userId]);
    await query('DELETE FROM Users WHERE id = ?', [userId]);

    return res.status(200).json({ message: 'Broker deleted successfully' });
  } catch (err) {
    console.error('Error deleting broker:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.approveBroker = async (req, res) => {
  try {
    const { id } = req.params;
    const brokers = await query('SELECT * FROM BrokerProfiles WHERE id = ?', [id]);
    if (brokers.length === 0) {
      return res.status(404).json({ message: 'Broker not found' });
    }

    await query("UPDATE BrokerProfiles SET approval_status = 'approved', updatedAt = NOW() WHERE id = ?", [id]);
    const updated = await query('SELECT * FROM BrokerProfiles WHERE id = ?', [id]);

    return res.status(200).json({ message: 'Broker approved successfully', broker: updated[0] });
  } catch (error) {
    console.error('Error approving broker:', error);
    return res.status(500).json({ message: 'Server error while approving broker' });
  }
};

exports.rejectBroker = async (req, res) => {
  try {
    const { id } = req.params;
    const brokers = await query('SELECT * FROM BrokerProfiles WHERE id = ?', [id]);
    if (brokers.length === 0) {
      return res.status(404).json({ message: 'Broker not found' });
    }

    await query("UPDATE BrokerProfiles SET approval_status = 'rejected', updatedAt = NOW() WHERE id = ?", [id]);
    const updated = await query('SELECT * FROM BrokerProfiles WHERE id = ?', [id]);

    return res.status(200).json({ message: 'Broker rejected successfully', broker: updated[0] });
  } catch (error) {
    console.error('Error rejecting broker:', error);
    return res.status(500).json({ message: 'Server error while rejecting broker' });
  }
};
