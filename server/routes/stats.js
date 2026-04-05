const express = require('express');
const router = express.Router();
const pool = require('../db/db');

/**
 * Extract leading numeric prefix from a hierarchical value.
 * e.g. "1- Renforcement..." → "1"
 *      "1.3- Promotion..."  → "1.3"
 *      "1.3.4- Production..." → "1.3.4"
 */
function extractPrefix(val) {
  if (!val) return null;
  const match = val.toString().trim().match(/^(\d+(?:\.\d+)*)/);
  return match ? match[1] : null;
}

/**
 * Build a WHERE clause fragment for a hierarchical field.
 * Tries: exact match, prefix LIKE, and keyword LIKE.
 * This handles both canonical values (after re-import) and raw Excel values.
 *
 * Examples:
 *   "1- Renforcement..."       → LIKE '1.%' OR LIKE '1-%' OR LIKE '%Renforcement%'
 *   "2- Inclusion économique..." → LIKE '2.%' OR LIKE '2-%' OR LIKE '%Inclusion%'
 *                                  (covers Excel's "Inclusion économique..." with no prefix)
 */
function hierarchyFilter(field, val, params) {
  if (!val) return '';

  const prefix = extractPrefix(val);

  const conditions = [`${field} = ?`];
  params.push(val);

  if (prefix) {
    // Match common hierarchical separators to avoid broad matches like '1%' matching '10'
    conditions.push(`${field} LIKE ?`);
    params.push(`${prefix}.%`);
    conditions.push(`${field} LIKE ?`);
    params.push(`${prefix}-%`);
    
    // Also try matching the bare prefix if some rows only stored the number
    conditions.push(`${field} = ?`);
    params.push(prefix);
  }

  return ` AND (${conditions.join(' OR ')})`;
}


// ─── GET /api/filters ──────────────────────────────────────────────────────────
router.get('/filters', async (req, res) => {
  try {
    const simpleFilters = ['gouvernorat', 'delegation', 'secteur'];
    const results = {};

    for (const filter of simpleFilters) {
      const [rows] = await pool.query(
        `SELECT DISTINCT ?? FROM beneficiaries WHERE ?? IS NOT NULL AND ?? <> '' ORDER BY ??`,
        [filter, filter, filter, filter]
      );
      results[filter] = rows.map(r => r[filter]);
    }

    // Annee with range guard
    const [anneeRows] = await pool.query(
      `SELECT DISTINCT annee FROM beneficiaries WHERE annee IS NOT NULL AND annee BETWEEN 2020 AND 2035 ORDER BY annee`
    );
    results.annee = anneeRows.map(r => r.annee);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ─── GET /api/stats ────────────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const {
      gouvernorat,
      delegation,
      secteur,
      annee,
      composante,
      sous_composante,
      activite,
    } = req.query;

    const params = [];
    let where = ' WHERE 1=1';

    if (gouvernorat)    { where += ` AND gouvernorat = ?`;    params.push(gouvernorat); }
    if (delegation)     { where += ` AND delegation = ?`;     params.push(delegation); }
    if (secteur)        { where += ` AND secteur = ?`;        params.push(secteur); }
    if (annee)          { where += ` AND annee = ?`;          params.push(annee); }

    // Hierarchical filters with prefix-based LIKE for robustness
    where += hierarchyFilter('composante',      composante,      params);
    where += hierarchyFilter('sous_composante', sous_composante, params);
    where += hierarchyFilter('activite',        activite,        params);

    // ── Summary stats ───────────────────────────────────────────────────────
    const summarySQL = `
      SELECT
        COUNT(*)                                                             AS total,
        SUM(CASE WHEN LOWER(sexe) LIKE '%homme%' OR sexe = 'H' THEN 1 ELSE 0 END) AS hommes,
        SUM(CASE WHEN LOWER(sexe) LIKE '%femme%' OR sexe = 'F' THEN 1 ELSE 0 END) AS femmes,
        SUM(CASE WHEN est_jeune = 1 THEN 1 ELSE 0 END)                      AS jeunes
      FROM beneficiaries${where}`;

    const [summaryRows] = await pool.query(summarySQL, params);
    const stats = summaryRows[0];

    // ── Gender chart ────────────────────────────────────────────────────────
    const genderData = [
      { label: 'Hommes', value: parseInt(stats.hommes) || 0 },
      { label: 'Femmes', value: parseInt(stats.femmes) || 0 },
    ];

    // ── Top-5 gouvernorats (respects all active filters) ────────────────────
    const govParams = [...params];
    const [govData] = await pool.query(
      `SELECT gouvernorat AS label, COUNT(*) AS value
       FROM beneficiaries${where}
       GROUP BY gouvernorat
       ORDER BY value DESC
       LIMIT 5`,
      govParams
    );

    res.json({
      summary: {
        total:  parseInt(stats.total)  || 0,
        hommes: parseInt(stats.hommes) || 0,
        femmes: parseInt(stats.femmes) || 0,
        jeunes: parseInt(stats.jeunes) || 0,
      },
      charts: {
        gender:      genderData,
        gouvernorat: govData,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ─── POST /api/reset ───────────────────────────────────────────────────────────
router.post('/reset', async (req, res) => {
  try {
    await pool.query('TRUNCATE TABLE beneficiaries');
    res.json({ success: true, message: 'Données réinitialisées avec succès.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la réinitialisation.' });
  }
});

// ─── GET /api/duplicates ──────────────────────────────────────────────────────
router.get('/duplicates', async (req, res) => {
  try {
    // We use a subquery to avoid any GROUP BY compatibility issues across different SQL versions
    const query = `
      SELECT 
        identifier, cin, nom, prenom, sous_composante, activity_count, activities
      FROM (
        SELECT 
          COALESCE(NULLIF(cin, ''), CONCAT(COALESCE(prenom, ''), ' ', COALESCE(nom, ''))) as identifier,
          cin, nom, prenom,
          sous_composante,
          COUNT(*) as activity_count,
          GROUP_CONCAT(activite SEPARATOR ' || ') as activities
        FROM beneficiaries
        GROUP BY cin, nom, prenom, sous_composante
      ) AS t
      WHERE t.activity_count > 1
      ORDER BY t.activity_count DESC
    `;

    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
