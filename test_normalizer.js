const { normalizeComposante, normalizeSousComposante, normalizeActivite } = require('./server/utils/normalizer');

const tests = [
  ['composante', '1.Renforcement de la resilience au changement climatique des populations rurales'],
  ['composante', 'Inclusion economique et sociale et commercialisation des du terroir'],
  ['sous_composante', "1.3- Promotion de l'agroforesterie et elevage"],
  ['sous_composante', '2- Assistance technique en genre et inclusion sociale (GAL'],
  ['activite', "1.3.4-Production de culture fourrageres dans l'assolement (Sulla)"],
  ['activite', '2.1.2-Assistance technique en genre et inclusion sociale (GALS)'],
];

tests.forEach(([type, raw]) => {
  let result;
  if (type === 'composante') result = normalizeComposante(raw);
  else if (type === 'sous_composante') result = normalizeSousComposante(raw);
  else result = normalizeActivite(raw);
  console.log('TYPE:', type);
  console.log('  RAW:', raw);
  console.log('   ->', result);
  console.log();
});
