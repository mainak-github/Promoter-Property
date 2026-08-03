const db = require('../../config/db');

// GET /api/public/stats
// Returns real counts: satisfied clients (leads), satisfied users, total properties, total brokers
exports.getStats = async (req, res) => {
  try {
    const [[{ satisfiedClients }]] = await db.query('SELECT COUNT(*) AS satisfiedClients FROM leads');
    const [[{ satisfiedUsers }]] = await db.query("SELECT COUNT(*) AS satisfiedUsers FROM Users WHERE role = 'client'");
    const [[{ totalProperties }]] = await db.query("SELECT COUNT(*) AS totalProperties FROM Properties WHERE approvalStatus = 'approved'");
    const [[{ totalBrokers }]] = await db.query("SELECT COUNT(*) AS totalBrokers FROM Users WHERE role = 'broker'");

    return res.status(200).json({
      status: 'success',
      data: {
        satisfiedClients,
        satisfiedUsers,
        totalProperties,
        totalBrokers
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch stats',
      error: error.message
    });
  }
};
