const fs = require('fs');
const path = require('path');
const db = require('./db');

async function initDb() {
  try {
    const schemaPath = path.join(__dirname, '../../schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    
    // Split statements by semicolon
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      await db.query(statement);
    }
    console.log('✅ Database tables verified / initialized successfully.');
  } catch (error) {
    console.error('❌ Error initializing database tables:', error);
  }
}

if (require.main === module) {
  initDb().then(() => process.exit(0));
}

module.exports = initDb;
