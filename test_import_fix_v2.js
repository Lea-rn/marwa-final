const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

// Try to find .env in current or server dir
const envPath = fs.existsSync('./server/.env') ? './server/.env' : './.env';
require('dotenv').config({ path: envPath });

const { processExcel } = require('./server/utils/excelProcessor');

async function testImport() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'dinamo'
    });

    try {
        const filePath = 'BD_BENEFICIAIRES__final.xlsx';
        if (!fs.existsSync(filePath)) {
            console.error(`File not found: ${filePath}`);
            return;
        }

        console.log(`Starting test import of ${filePath}...`);
        const count = await processExcel(filePath, connection);
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
