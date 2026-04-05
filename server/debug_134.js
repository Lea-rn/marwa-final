const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const pool = require('./db/db');

async function debug() {
  try {
    const composante = "1- Renforcement de la résilience au changement climatique";
    const sous_composante = "1.3- Promotion de l'agroforesterie et élevage";
    const activite = "1.3.4- Production de cultures fourragères dans l'assolement";

    console.log('--- DEBUGGING ACTIVITY 1.3.4 ---');
    
    // Total count
    const [total] = await pool.query(
      `SELECT COUNT(*) as count FROM beneficiaries WHERE composante = ? AND sous_composante = ? AND activite = ?`,
      [composante, sous_composante, activite]
    );
    console.log('Total rows for 1.3.4:', total[0].count);

    // Sample data to see if they look like real beneficiaries
    const [samples] = await pool.query(
      `SELECT gouvernorat, delegation, secteur, annee, sexe, age FROM beneficiaries 
       WHERE composante = ? AND sous_composante = ? AND activite = ? LIMIT 20`,
      [composante, sous_composante, activite]
    );
    console.log('Sample rows:');
    samples.forEach((s, i) => console.log(`${i+1}: ${s.gouvernorat}, ${s.delegation}, ${s.secteur}, Year: ${s.annee}, Sex: ${s.sexe}, Age: ${s.age}`));

    // Check if these rows are duplicated
    const [uniques] = await pool.query(
      `SELECT COUNT(DISTINCT gouvernorat, delegation, secteur, annee, sexe, age) as count FROM beneficiaries 
       WHERE composante = ? AND sous_composante = ? AND activite = ?`,
      [composante, sous_composante, activite]
    );
    console.log('Unique rows (based on gov, del, sec, year, sex, age):', uniques[0].count);

    // Check what OTHER activities exist in Subcomponent 1.3
    const [others] = await pool.query(
        `SELECT activite, COUNT(*) as count FROM beneficiaries 
         WHERE composante = ? AND sous_composante = ? 
         GROUP BY activite`,
        [composante, sous_composante]
      );
    console.log('All activities in Subcomponent 1.3:');
    others.forEach(o => console.log(`- ${o.count}: ${o.activite}`));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

debug();
