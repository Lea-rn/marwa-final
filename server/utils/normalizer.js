/**
 * Normalizes raw Excel hierarchical values to canonical HierarchicalSelect keys.
 * Handles format differences like "1.Renforcement..." → "1- Renforcement..."
 */
const DATA = require('./hierarchicalData');

// Flatten all keys for lookup
const ALL_COMPOSANTES = Object.keys(DATA);
const ALL_SOUS_COMPOSANTES = ALL_COMPOSANTES.flatMap(c => Object.keys(DATA[c]));
const ALL_ACTIVITES = ALL_COMPOSANTES.flatMap(c =>
  Object.keys(DATA[c]).flatMap(sc => DATA[c][sc])
);

/**
 * Extract the leading numeric prefix from a string.
 * e.g. "1.3- Promotion..." → "1.3"
 *      "1.Renforcement..." → "1"
 *      "2.1.5- Éducation..." → "2.1.5"
 */
function extractPrefix(str) {
  if (!str) return '';
  const trimmed = str.toString().trim();
  const match = trimmed.match(/^(\d+(?:\.\d+)*)/);
  return match ? match[1] : '';
}

/**
 * Find the best canonical match from a list of candidates by:
 * 1. Exact match
 * 2. Prefix match (numeric code)
 * 3. Keyword fuzzy match
 */
function findBestMatch(raw, candidates) {
  if (!raw) return null;
  const rawStr = raw.toString().trim();

  // 1. Exact match
  const exact = candidates.find(c => c === rawStr);
  if (exact) return exact;

  // 2. Prefix match: extract numeric part from raw, find candidate starting with same numeric + separator
  const rawPrefix = extractPrefix(rawStr);
  if (rawPrefix) {
    const prefixMatch = candidates.find(c => {
      const cp = extractPrefix(c);
      return cp === rawPrefix;
    });
    if (prefixMatch) return prefixMatch;
  }

  // 3. Keyword fuzzy: normalize both strings and find partial match
  const normalize = str => str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // remove accents
    .replace(/[^a-z0-9\s]/g, ' ')     // remove special chars
    .trim();

  const rawNorm = normalize(rawStr).split(/\s+/).filter(w => w.length > 4);
  if (rawNorm.length > 0) {
    const fuzzyMatch = candidates.find(c => {
      const cNorm = normalize(c);
      return rawNorm.every(word => cNorm.includes(word));
    });
    if (fuzzyMatch) return fuzzyMatch;

    // Partial: at least half the words match
    const partialMatch = candidates.find(c => {
      const cNorm = normalize(c);
      const matchCount = rawNorm.filter(word => cNorm.includes(word)).length;
      return matchCount >= Math.ceil(rawNorm.length / 2);
    });
    if (partialMatch) return partialMatch;
  }

  return null; // no match found, will store as-is
}

function normalizeComposante(raw) {
  return findBestMatch(raw, ALL_COMPOSANTES) || (raw ? raw.toString().trim() : null);
}

function normalizeSousComposante(raw) {
  return findBestMatch(raw, ALL_SOUS_COMPOSANTES) || (raw ? raw.toString().trim() : null);
}

function normalizeActivite(raw) {
  return findBestMatch(raw, ALL_ACTIVITES) || (raw ? raw.toString().trim() : null);
}

/**
 * Extract numeric prefix from a HierarchicalSelect canonical value for LIKE queries.
 * e.g. "1- Renforcement..." → "1"
 *      "1.3- Promotion..." → "1.3"
 */
function extractFilterPrefix(val) {
  return extractPrefix(val);
}

module.exports = {
  normalizeComposante,
  normalizeSousComposante,
  normalizeActivite,
  extractFilterPrefix,
};
