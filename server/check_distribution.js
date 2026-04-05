const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const pool = require('./db/db');

async function check() {
  try {
    const [rows] = await pool.query('SELECT activite, COUNT(*) as count FROM beneficiaries GROUP BY activite ORDER BY count DESC');
    console.log('Activity distribution in DB:');
    rows.forEach(r => console.log(`${r.count}: ${r.activite}`));

    const [compRows] = await pool.query('SELECT composante, COUNT(*) as count FROM beneficiaries GROUP BY composante');
    console.log('Component distribution in DB:');
    compRows.forEach(r => console.log(`${r.count}: ${r.composante}`));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
