const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const pool = require('./db/db');

async function debug() {
  try {
    const composante = "1- Renforcement de la résilience au changement climatique";
    const sous_composante = "1.3- Promotion de l'agroforesterie et élevage";
    const activite = "1.3.4- Production de cultures fourragères dans l'assolement";

    console.log('--- DB STATE AFTER RE-UPLOAD ---');

    // 1. Direct query using EXACT match only
    const [exactQuery] = await pool.query(
      `SELECT COUNT(*) as count FROM beneficiaries 
       WHERE composante = ? AND sous_composante = ? AND activite = ?`,
      [composante, sous_composante, activite]
    );
    console.log(`EXACT match count for 1.3.4: ${exactQuery[0].count}`);

    // 2. Direct query using prefix match only
    const [prefixQuery] = await pool.query(
      `SELECT COUNT(*) as count FROM beneficiaries 
       WHERE activite LIKE ? OR activite LIKE ?`,
      ['1.3.4.%', '1.3.4-%']
    );
    console.log(`PREFIX ('1.3.4.%' or '1.3.4-%') count: ${prefixQuery[0].count}`);

    // 3. See what activity strings actually exist in the DB for subcomponent 1.3
    const [distinctActivities] = await pool.query(
        `SELECT DISTINCT activite FROM beneficiaries 
         WHERE composante = ? AND sous_composante = ?`,
        [composante, sous_composante]
    );
    console.log('\nDistinct activities stored in DB for subcomponent 1.3:');
    distinctActivities.forEach(a => console.log(`- "${a.activite}"`));

    // 4. Trace the stats logic
    function extractPrefix(val) {
      if (!val) return null;
      const match = val.toString().trim().match(/^(\d+(?:\.\d+)*)/);
      return match ? match[1] : null;
    }
    const prefixStr = extractPrefix(activite);
    console.log(`\nExtracted prefix from requested activity: "${prefixStr}"`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

debug();
