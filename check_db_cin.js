require('dotenv').config({ path: './server/.env' });
const mysql = require('mysql2/promise');

async function checkDB() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'dinamo'
    });

    try {
        const [rows] = await pool.query('SELECT * FROM beneficiaries LIMIT 5');
        console.log('Sample data from DB:');
        rows.forEach(r => console.log(r));
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkDB();
