const XLSX = require('xlsx');
const fs = require('fs');

const filePath = 'BD_BENEFICIAIRES__final.xlsx';
if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
}

try {
    const workbook = XLSX.readFile(filePath);
    console.log('Sheet Names:', workbook.SheetNames);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
    console.log('Total Rows:', jsonData.length);

    const headerIndex = 4;
    const headers = jsonData[headerIndex];
    if (!headers) {
        console.error('Headers not found at index', headerIndex);
        process.exit(1);
    }
    console.log('Headers:', headers);

    const colMap = {
        composante: headers.findIndex(h => h && h.toString().toLowerCase().includes('composant') && !h.toString().toLowerCase().includes('sous')),
        sous_composante: headers.findIndex(h => h && (h.toString().toLowerCase().includes('sous composant') || h.toString().toLowerCase().includes('sous-composant'))),
        activite: headers.findIndex(h => h && (h.toString().toLowerCase().includes('activité') || h.toString().toLowerCase().includes('activit'))),
    };

    console.log('Col Map:', colMap);

    const composantes = new Set();
    const sous_composantes = new Set();
    const activites = new Set();

    const rows = jsonData.slice(headerIndex + 1);
    rows.forEach((row, i) => {
        const c = row[colMap.composante] ? row[colMap.composante].toString().trim() : '';
        const sc = row[colMap.sous_composante] ? row[colMap.sous_composante].toString().trim() : '';
        const a = row[colMap.activite] ? row[colMap.activite].toString().trim() : '';
        
        if (c) composantes.add(c);
        if (sc) sous_composantes.add(sc);
        if (a) activites.add(a);
    });

    console.log('--- Unique Composantes ---');
    console.log(JSON.stringify(Array.from(composantes).sort(), null, 2));

    console.log('--- Unique Sous-Composantes ---');
    console.log(JSON.stringify(Array.from(sous_composantes).sort(), null, 2));

    console.log('--- Unique Activités ---');
    console.log(JSON.stringify(Array.from(activites).sort(), null, 2));
} catch (e) {
    console.error('Error:', e);
}
