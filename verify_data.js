const pool = require('./server/db/db');

async function check() {
  try {
    const [totalRows] = await pool.query('SELECT COUNT(*) as count FROM beneficiaries');
    console.log('Total rows in beneficiaries:', totalRows[0].count);

    const [compRows] = await pool.query('SELECT composante, COUNT(*) as count FROM beneficiaries GROUP BY composante');
    console.log('Composante distribution:', compRows);

    // Check specific case: Comp 1, Subcomp 1.3, Activity 1.3.4
    // Use the same logic as stats.js but inspect intermediate results
    const composante = "1- Renforcement de la résilience au changement climatique";
    const sous_composante = "1.3- Promotion de l'agroforesterie et élevage";
    const activite = "1.3.4- Production de cultures fourragères dans l'assolement";

    function extractPrefix(val) {
      if (!val) return null;
      const match = val.toString().trim().match(/^(\d+(?:\.\d+)*)/);
      return match ? match[1] : null;
    }

    function hierarchyFilter(field, val, params) {
      if (!val) return '';
      const prefix = extractPrefix(val);
      const descPart = val.trim().replace(/^\d[\d.]*\s*[-–.]\s*/, '');
      const firstKeyword = descPart.split(/\s+/).find(w => w.length > 4) || '';
      const conditions = [`${field} = ?`];
      params.push(val);
      if (prefix) {
        conditions.push(`${field} LIKE ?`); params.push(`${prefix}.%`);
        conditions.push(`${field} LIKE ?`); params.push(`${prefix}-%`);
        conditions.push(`${field} LIKE ?`); params.push(`${prefix}%`);
      }
      if (firstKeyword) {
        conditions.push(`${field} LIKE ?`); params.push(`%${firstKeyword}%`);
      }
      return ` AND (${conditions.join(' OR ')})`;
    }

    let params = [];
    let where = ' WHERE 1=1';
    where += hierarchyFilter('composante',      composante,      params);
    where += hierarchyFilter('sous_composante', sous_composante, params);
    where += hierarchyFilter('activite',        activite,        params);

    console.log('Generated WHERE:', where);
    console.log('Params:', params);

    const [result] = await pool.query(`SELECT COUNT(*) as count FROM beneficiaries ${where}`, params);
    console.log('Result with hierarchical filters:', result[0].count);

    // Test with EXACT matches ONLY
    const [exactResult] = await pool.query(
      `SELECT COUNT(*) as count FROM beneficiaries WHERE composante = ? AND sous_composante = ? AND activite = ?`,
      [composante, sous_composante, activite]
    );
    console.log('Result with EXACT filters:', exactResult[0].count);

    // Inspect some samples of the 718 rows if they exist
    if (result[0].count > 0) {
      const [samples] = await pool.query(
        `SELECT composante, sous_composante, activite FROM beneficiaries ${where} LIMIT 10`,
        params
      );
      console.log('Sample rows matching filters:', samples);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
