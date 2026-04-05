const XLSX = require('xlsx');
const { normalizeComposante, normalizeSousComposante, normalizeActivite } = require('./normalizer');

const YOUTH_AGE_LIMIT = 39;

/**
 * Excel column indices (0-based) based on row 4 headers:
 * 0:  N° Ordre
 * 1:  ANNEE ACTIVITE
 * 2:  SECTEUR
 * 3:  DELEGATION
 * 4:  N°CIN
 * 5:  PRENOM
 * 6:  NOM
 * 7:  ANNEE NAISSANCE
 * 8:  AGE
 * 9:  GENRE
 * 10: H
 * 11: F
 * 12: J
 * 13: MAITRE D'OUVRAGE
 * 14: COMPOSANT
 * 15: Sous Composant
 * 16: Activite
 * 17: TECHNICIEN_SUIVI
 * 18: PERIMETRE/DOUAR
 * 19: PARCELLE PLANTEE (HA)
 * 20: SUP PROTEGEE CES (HA)
 * 21: Gouvernorat
 */
const COL = {
  annee:          1,
  secteur:        2,
  delegation:     3,
  cin:            4,
  prenom:         5,
  nom:            6,
  age:            8,
  genre:          9,
  h:              10,
  f:              11,
  j:              12,
  composante:     14,
  sous_composante:15,
  activite:       16,
  gouvernorat:    21,
};

const HEADER_ROW = 4;

async function processExcel(filePath, connection) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

  // Verify headers match expected layout
  const headers = jsonData[HEADER_ROW] ? jsonData[HEADER_ROW].map(h => h.toString().trim()) : [];
  console.log(`Processing ${filePath} — ${jsonData.length} rows, headers detected:`, headers.slice(0, 22));

  // Clear existing data before import
  await connection.execute('TRUNCATE TABLE beneficiaries');

  const rows = jsonData.slice(HEADER_ROW + 1);

  const val = (row, idx) =>
    idx !== -1 && row[idx] !== undefined ? row[idx].toString().trim() : '';
  const num = (row, idx) => {
    const v = parseInt(row[idx]);
    return isNaN(v) ? null : v;
  };

  let insertedCount = 0;
  let skippedCount = 0;

  // Carry-forward state for hierarchical fields
  let lastComposante = '';
  let lastSousComposante = '';
  let lastActivite = '';

  for (const row of rows) {
    // Update carry-forward values whenever a cell is present
    const rawC  = val(row, COL.composante);
    const rawSC = val(row, COL.sous_composante);
    const rawA  = val(row, COL.activite);

    if (rawC) {
      lastComposante = normalizeComposante(rawC) || rawC;
      lastSousComposante = '';
      lastActivite = '';
    }
    if (rawSC) {
      lastSousComposante = normalizeSousComposante(rawSC) || rawSC;
      lastActivite = '';
    }
    if (rawA) {
      lastActivite = normalizeActivite(rawA) || rawA;
    }

    // Skip rows that have no beneficiary data
    const isH = val(row, COL.h) === '1' || row[COL.h] === 1;
    const isF = val(row, COL.f) === '1' || row[COL.f] === 1;
    const isJ = val(row, COL.j) === '1' || row[COL.j] === 1;
    const gouvernorat = val(row, COL.gouvernorat);
    const delegation  = val(row, COL.delegation);

    if (!isH && !isF && !gouvernorat && !delegation) {
      skippedCount++;
      continue;
    }

    const sexe = isH ? 'Homme' : (isF ? 'Femme' : null);
    const age  = num(row, COL.age);
    const est_jeune = isJ || (age !== null && age <= YOUTH_AGE_LIMIT);

    const query = `INSERT INTO beneficiaries
      (gouvernorat, delegation, secteur, annee, composante, sous_composante, activite, cin, prenom, nom, sexe, age, est_jeune, source_file)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    if (insertedCount === 0 || insertedCount % 100 === 0) {
      console.log(`[Import] Row ${insertedCount}: CIN raw from Excel: "${val(row, COL.cin)}"`);
    }

    await connection.execute(query, [
      gouvernorat   || null,
      delegation    || null,
      val(row, COL.secteur)  || null,
      num(row, COL.annee),
      lastComposante       || null,
      lastSousComposante   || null,
      lastActivite         || null,
      val(row, COL.cin)    || null,
      val(row, COL.prenom) || null,
      val(row, COL.nom)    || null,
      sexe,
      age,
      est_jeune ? 1 : 0,
      'Uploaded File',
    ]);

    insertedCount++;
    if (insertedCount % 500 === 0) {
      console.log(`  Imported ${insertedCount} rows...`);
    }
  }

  console.log(`Done: ${insertedCount} inserted, ${skippedCount} skipped.`);
  return insertedCount;
}

module.exports = { processExcel };
