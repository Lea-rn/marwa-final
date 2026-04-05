const XLSX = require('xlsx');
const fs = require('fs');

const filePath = 'BD_BENEFICIAIRES__final.xlsx';
if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
}

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

    const headerIndex = 4;
    const headers = jsonData[headerIndex];
    console.log('--- Headers at index 4 ---');
    headers.forEach((h, i) => console.log(`${i}: ${h}`));

    const colMap = {
        composante: headers.findIndex(h => h && h.toString().toLowerCase().includes('composant') && !h.toString().toLowerCase().includes('sous')),
        sous_composante: headers.findIndex(h => h && (h.toString().toLowerCase().includes('sous composant') || h.toString().toLowerCase().includes('sous-composant'))),
        activite: headers.findIndex(h => h && (h.toString().toLowerCase().includes('activité') || h.toString().toLowerCase().includes('activit'))),
    };

    console.log('\n--- Detected Column Mapping ---');
    console.log(colMap);

    const composantes = new Set();
    const sous_composantes = new Set();
    const activites = new Set();

    // Sample first 100 rows to see values
    const rows = jsonData.slice(headerIndex + 1);
    rows.forEach((row, rowIndex) => {
        const c = row[colMap.composante] ? row[colMap.composante].toString().trim() : '';
        const sc = row[colMap.sous_composante] ? row[colMap.sous_composante].toString().trim() : '';
        const a = row[colMap.activite] ? row[colMap.activite].toString().trim() : '';
        
        if (c) composantes.add(c);
        if (sc) sous_composantes.add(sc);
        if (a) activites.add(a);
        
        if (rowIndex < 10) {
            console.log(`Row ${rowIndex}: C=${c}, SC=${sc}, A=${a}`);
        }
    });

    console.log('\n--- Unique Composantes (Total: ' + composantes.size + ') ---');
    console.log(Array.from(composantes).sort());

    console.log('\n--- Unique Sous-Composantes (Total: ' + sous_composantes.size + ') ---');
    console.log(Array.from(sous_composantes).sort());

    console.log('\n--- Unique Activités (Total: ' + activites.size + ') ---');
    console.log(Array.from(activites).sort());

} catch (e) {
    console.error('Error:', e);
}
