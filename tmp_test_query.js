const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

async function testQuery() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    console.log('Connected to DB.');
    const query = `
      SELECT 
        COALESCE(NULLIF(cin, ''), CONCAT(COALESCE(prenom, ''), ' ', COALESCE(nom, ''))) as identifier,
        cin, prenom, nom,
        sous_composante,
        COUNT(*) as activity_count,
        GROUP_CONCAT(activite SEPARATOR ' || ') as activities
      FROM beneficiaries
      GROUP BY 
        COALESCE(NULLIF(cin, ''), CONCAT(COALESCE(prenom, ''), ' ', COALESCE(nom, ''))),
        sous_composante
      HAVING activity_count > 1
      ORDER BY activity_count DESC
    `;

    const [rows] = await connection.query(query);
    console.log('Query result:', rows);

  } catch (err) {
    console.error('Query failed:', err);
  } finally {
    if (connection) await connection.end();
  }
}

testQuery();
