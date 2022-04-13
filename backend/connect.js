const mysql2 = require('mysql2/promise');

const db = mysql2.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '1234',
  database: 'tcotlk',
});

db.getConnection().catch((err) => {
  throw new Error(`${err.sqlMessage || '連線失敗。'}`);
});

module.exports = db;
