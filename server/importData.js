const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { processExcel } = require('./utils/excelProcessor');

async function importExcel(filePath) {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    console.log(`Starting import for ${filePath}...`);
    const count = await processExcel(filePath, connection);
    console.log(`Import finished: ${count} beneficiaries imported.`);

  } catch (err) {
    console.error(`Error importing ${filePath}:`, err);
  } finally {
    if (connection) await connection.end();
  }
}

async function run() {
  const filePath = path.join(__dirname, '../BD_BENEFICIAIRES__final.xlsx');
  await importExcel(filePath);
}

run().then(() => {
  console.log('Total import process finished.');
  process.exit(0);
});
