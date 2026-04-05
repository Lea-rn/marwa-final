const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const pool = require('./db/db');

async function check() {
  try {
    const composante = "1- Renforcement de la résilience au changement climatique";
    const sous_composante = "1.3- Promotion de l'agroforesterie et élevage";
    const activite = "1.3.4- Production de cultures fourragères dans l'assolement";

    function extractPrefix(val) {
      if (!val) return null;
      const match = val.toString().trim().match(/^(\d+(?:\.\d+)*)/);
      return match ? match[1] : null;
    }

    // SIMULATE the NEW hierarchyFilter logic from stats.js
    function hierarchyFilter(field, val, params) {
      if (!val) return '';
      const prefix = extractPrefix(val);
      const conditions = [`${field} = ?`];
      params.push(val);
      if (prefix) {
        conditions.push(`${field} LIKE ?`); params.push(`${prefix}.%`);
        conditions.push(`${field} LIKE ?`); params.push(`${prefix}-%`);
        conditions.push(`${field} = ?`); params.push(prefix);
      }
      return ` AND (${conditions.join(' OR ')})`;
    }

    let params = [];
    let where = ' WHERE 1=1';
    where += hierarchyFilter('composante',      composante,      params);
    where += hierarchyFilter('sous_composante', sous_composante, params);
    where += hierarchyFilter('activite',        activite,        params);

    const [result] = await pool.query(`SELECT COUNT(*) as count FROM beneficiaries ${where}`, params);
    console.log('--- VERIFICATION RESULTS ---');
    console.log('Filters Applied:', { composante: '1', sous_composante: '1.3', activite: '1.3.4' });
    console.log('Result with NEW hierarchical logic:', result[0].count);

    const [exactResult] = await pool.query(
      `SELECT COUNT(*) as count FROM beneficiaries WHERE composante = ? AND sous_composante = ? AND activite = ?`,
      [composante, sous_composante, activite]
    );
    console.log('Result with EXACT match logic:', exactResult[0].count);
    
    if (result[0].count === exactResult[0].count) {
      console.log('SUCCESS: Hierarchical filters now match EXACT results (24).');
    } else {
      console.log('FAILURE: Counts still differ!');
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
