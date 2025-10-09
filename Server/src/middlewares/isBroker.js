// middleware/isBroker.js
module.exports = (req, res, next) => {
  if (req.user.role !== 'broker') {
    return res.status(403).json({ message: 'Access denied. Brokers only.' });
  }
  next();
};
