const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: './server/.env' });
const { processExcel } = require('./server/utils/excelProcessor');

async function testImport() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    try {
        console.log('Starting test import of BD_BENEFICIAIRES__final.xlsx...');
        const count = await processExcel('BD_BENEFICIAIRES__final.xlsx', connection);
        console.log(`Successfully imported ${count} rows.`);

        // Check if delegation is now populated
        const [rows] = await connection.execute('SELECT delegation FROM beneficiaries WHERE delegation IS NOT NULL LIMIT 5');
        console.log('Sample delegations from DB:', rows.map(r => r.delegation));

    } catch (err) {
        console.error('Import failed:', err);
    } finally {
        await connection.end();
    }
}

testImport();
