const mysql = require('mysql2/promise');
const { processExcel } = require('./utils/excelProcessor');
const path = require('path');
require('dotenv').config();

async function run() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    const excelFile = path.resolve(__dirname, '../BD_BENEFICIAIRES__final.xlsx');
    console.log('Starting import of', excelFile, '...');
    try {
        const count = await processExcel(excelFile, connection);
        console.log(`Successfully imported ${count} rows.`);
    } catch (err) {
        console.error('Import failed:', err);
    } finally {
        await connection.end();
    }
}

run();
