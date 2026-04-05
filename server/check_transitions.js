const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const pool = require('./db/db');

async function getTransitions() {
  try {
    const composante = "1- Renforcement de la résilience au changement climatique";
    const sous_composante = "1.3- Promotion de l'agroforesterie et élevage";
    const activite = "1.3.4- Production de cultures fourragères dans l'assolement";

    const [rows] = await pool.query(
      `SELECT id, composante, sous_composante, activite, annee, sexe, secteur, delegation 
       FROM beneficiaries 
       WHERE composante = ? AND sous_composante = ? 
       ORDER BY id ASC`,
      [composante, sous_composante]
    );

    let currentActivity = null;
    let activityCount = 0;

    for (const row of rows) {
      if (row.activite !== currentActivity) {
        if (currentActivity !== null) {
          console.log(`Finished block of ${activityCount} rows for: ${currentActivity.substring(0, 30)}...`);
        }
        console.log(`\nTransition at ID ${row.id}: NEW ACTIVITY: ${row.activite.substring(0, 30)}...`);
        console.log(`Sample row data: Year=${row.annee}, Sex=${row.sexe}, Sect=${row.secteur}, Del=${row.delegation}`);
        currentActivity = row.activite;
        activityCount = 1;
      } else {
        activityCount++;
      }
    }
    if (activityCount > 0) {
      console.log(`Finished block of ${activityCount} rows for: ${currentActivity.substring(0, 30)}...`);
    }

    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

getTransitions();
