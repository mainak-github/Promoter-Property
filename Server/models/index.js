const db = require('../src/config/db');

module.exports = {
  db,
  query: db.query,
  getConnection: db.getConnection,
  pool: db.pool
};
