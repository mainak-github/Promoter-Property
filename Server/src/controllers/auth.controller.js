const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'client' // Default to client if not provided
    });

    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
    
  }
};


exports.listusers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: 'client' },
      // include: [{ model: BrokerProfile, as: 'brokerProfile' }]
    });
    res.status(200).json({ message: 'Users fetched successfully', users: users });
    console.log('Users fetched successfully', users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.userDetails = async (req, res) => {
 
  try {
    const UserDetails = await User.findAll({
      where: {id: req.params.id },
     
    });
   if (!UserDetails) {
      return res.status(404).json({ message: 'UserDetails not found' });
    }
    console.log('UserDetails fetched successfully', UserDetails);
    res.status(200).json({ message: 'UserDetails fetched successfully', UserDetails: UserDetails });

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch User' });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const userProfile = await User.findOne({ where: { id } });
    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Delete records
    await User.destroy({ where: { id: id } });

    return res.status(200).json({ message: 'User deleted successfully' });

  } catch (err) {
    console.error('Error deleting user:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, ...otherData } = req.body;

    // ✅ If password is present, hash it
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      otherData.password = hashedPassword;
    }

    const [updated] = await User.update(otherData, { where: { id } });

    if (updated) {
      const updatedUser = await User.findOne({ where: { id } });
      return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};
