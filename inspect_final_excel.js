const XLSX = require('xlsx');
const path = require('path');

const filePath = 'BD_BENEFICIAIRES__final.xlsx';

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

    console.log(`--- Inspecting ${filePath} ---`);
    console.log(`Total rows: ${jsonData.length}`);

    const headersRow = jsonData[4];
    console.log('Headers (Row 4):', headersRow);
    
    for (let i = 5; i < Math.min(20, jsonData.length); i++) {
        const row = jsonData[i];
        console.log(`Row ${i} Hierarchical Info:`, {
            composante: row[7],
            sous_composante: row[8],
            activite: row[9]
        });
    }

} catch (err) {
    console.error(`Error inspecting file: ${err.message}`);
}
