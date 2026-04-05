const { normalizeComposante, normalizeSousComposante, normalizeActivite } = require('./server/utils/normalizer');

console.log("--- Normalizer Test ---");

const tests = [
  "1.1- Amélioration de l'accès en eau et de l'habitat",
  "1.1.1- Etude et contrôle",
  "Production",
  "Aménagement puits",
  "Plantation",
  "1.3.4- Production de cultures fourragères dans l'assolement",
  "1.3.9- Renforcement des capacités",
  "1",
  "1.1",
  "Production de cultures"
];

for (const t of tests) {
  console.log(`\nInput: "${t}"`);
  console.log(`  Composante: ${normalizeComposante(t)}`);
  console.log(`  Sous-Composante: ${normalizeSousComposante(t)}`);
  console.log(`  Activite: ${normalizeActivite(t)}`);
}
