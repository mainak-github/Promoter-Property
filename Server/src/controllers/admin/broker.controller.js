const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');
const { User, BrokerProfile } = require('../../../models');


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

    // Step 1: Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'broker'
    });

    // Safe name for folder
    const safeName = name.replace(/\s+/g, '_') + `_${user.id}`;
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

    // Step 2: Create broker profile
    const brokerProfile = await BrokerProfile.create({
      userId: user.id,
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
      approval_status: ['pending', 'approved', 'rejected'].includes(approval_status) ? approval_status : 'pending',
      created_by
    });

    return res.status(201).json({ user, brokerProfile });

  } catch (err) {
    console.error('Error creating broker:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};



exports.listBrokers = async (req, res) => {
  try {
    const brokers = await BrokerProfile.findAll({
      // where: { role: 'broker' },
      // include: [{ model: BrokerProfile, as: 'brokerProfile' }]
    });
    res.status(200).json({ message: 'Brokers fetched successfully', brokers: brokers });
    console.log('Brokers fetched successfully', brokers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch brokers' });
  }
};

exports.brokerDetails = async (req, res) => {
 
  try {
    const broker = await BrokerProfile.findAll({
      where: {id: req.params.id },
     
    });
   if (!broker) {
      return res.status(404).json({ message: 'Broker not found' });
    }
    console.log('Brokers fetched successfully', broker);
    res.status(200).json({ message: 'Broker fetched successfully', broker: broker });

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch broker' });
  }
};

exports.deactivateBroker = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user || user.role !== 'broker') {
      return res.status(404).json({ message: 'Broker not found' });
    }

    user.active = false; // assuming you have an `active` field
    await user.save();

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

    // Step 1: Update User name
    await User.update({ fullName }, { where: { id: id } });

    // Step 2: Fetch existing broker profile
    const broker = await BrokerProfile.findOne({ where: { id } });
    if (!broker) return res.status(404).json({ error: 'Broker not found' });

    // Build safe folder name
    const safeName = fullName.replace(/\s+/g, '_') + `_${id}`;
    const brokerFolderPath = path.join('uploads', 'brokers', safeName);
    fs.mkdirSync(brokerFolderPath, { recursive: true });

    // File replacements
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

    // Step 3: Update BrokerProfile
    await BrokerProfile.update({
      fullName: fullName,
      mobileNumber,
      companyName,
      companyRegNo,
      gstId,
      brokerRegNo,
      address,
      memberId,
      agreementFile: agreementFilePath,
      profilePhoto: profilePhotoPath
    }, { where: { id } });

    return res.status(200).json({ message: 'Broker updated successfully' });

  } catch (err) {
    console.error('Error updating broker:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteBroker = async (req, res) => {
  try {
    const userId = req.params.userId;

    const brokerProfile = await BrokerProfile.findOne({ where: { userId } });
    if (!brokerProfile) {
      return res.status(404).json({ error: 'Broker profile not found' });
    }

    const user = await User.findByPk(userId);
    if (!user || user.role !== 'broker') {
      return res.status(404).json({ error: 'Broker user not found' });
    }

    // Construct folder path
    const safeName = user.name.replace(/\s+/g, '_') + `_${userId}`;
    const brokerFolder = path.join('uploads', 'brokers', safeName);

    // Delete the broker folder (recursively)
    if (fs.existsSync(brokerFolder)) {
      fs.rmSync(brokerFolder, { recursive: true, force: true });
    }

    // Delete records
    await BrokerProfile.destroy({ where: { userId } });
    await User.destroy({ where: { id: userId } });

    return res.status(200).json({ message: 'Broker deleted successfully' });

  } catch (err) {
    console.error('Error deleting broker:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


// ✅ Approve broker
exports.approveBroker = async (req, res) => {
  try {
    const { id } = req.params;

    const broker = await BrokerProfile.findByPk(id);

    if (!broker) {
      return res.status(404).json({ message: 'Broker not found' });
    }

    broker.approval_status = 'approved';
    await broker.save();

    return res.status(200).json({
      message: 'Broker approved successfully',
      broker,
    });
  } catch (error) {
    console.error('Error approving broker:', error);
    return res.status(500).json({ message: 'Server error while approving broker' });
  }
};


// ❌ Reject broker
exports.rejectBroker = async (req, res) => {
  try {
    const { id } = req.params;

    const broker = await BrokerProfile.findByPk(id);

    if (!broker) {
      return res.status(404).json({ message: 'Broker not found' });
    }

    broker.approval_status = 'rejected';
    await broker.save();

    return res.status(200).json({
      message: 'Broker rejected successfully',
      broker,
    });
  } catch (error) {
    console.error('Error rejecting broker:', error);
    return res.status(500).json({ message: 'Server error while rejecting broker' });
  }
};


// gertbrokerbyId
// Controller: Get broker by ID
exports.brokerDetails = async (req, res) => {
  try {
    const broker = await BrokerProfile.findOne({ where: { id: req.params.id } });

    if (!broker) {
      return res.status(404).json({ message: 'Broker not found' });
    }

    res.status(200).json({ message: 'Broker fetched successfully', broker:broker });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch broker' });
  }
};
