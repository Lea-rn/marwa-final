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
    
    const colMap = {
        composante: 14, // COMPOSANT
        sous_composante: 15, // Sous Composant
        activite: 16, // Activite
    };

    const composantes = new Set();
    const sous_composantes = new Set();
    const activites = new Set();

    const rows = jsonData.slice(headerIndex + 1);
    rows.forEach((row) => {
        const c = row[colMap.composante] ? row[colMap.composante].toString().trim() : '';
        const sc = row[colMap.sous_composante] ? row[colMap.sous_composante].toString().trim() : '';
        const a = row[colMap.activite] ? row[colMap.activite].toString().trim() : '';
        
        if (c) composantes.add(c);
        if (sc) sous_composantes.add(sc);
        if (a) activites.add(a);
    });

    console.log('--- ALL UNIQUE VALUES IN EXCEL ---');
    console.log('COMPOSANTES:', Array.from(composantes).sort());
    console.log('SOUS_COMPOSANTES:', Array.from(sous_composantes).sort());
    console.log('ACTIVITES:', Array.from(activites).sort());

} catch (e) {
    console.error('Error:', e);
}
