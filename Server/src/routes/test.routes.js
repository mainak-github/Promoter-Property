const express = require('express');
const router = express.Router();
const { verifyToken, allowRoles } = require('../middlewares/auth.middleware');

router.get('/admin', verifyToken, allowRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin 👑' });
});

router.get('/broker', verifyToken, allowRoles('broker'), (req, res) => {
  res.json({ message: 'Hello Broker 📊' });
});

router.get('/client', verifyToken, allowRoles('client'), (req, res) => {
  res.json({ message: 'Hey Client 🏠' });
});

module.exports = router;
