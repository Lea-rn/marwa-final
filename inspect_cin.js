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

    const headerRowIdx = 4; // Based on excelProcessor.js
    const headersRow = jsonData[headerRowIdx];
    console.log('Headers (Row 4):', headersRow);
    
    // Column 4 is CIN according to excelProcessor.js
    for (let i = headerRowIdx + 1; i < Math.min(headerRowIdx + 11, jsonData.length); i++) {
        const row = jsonData[i];
        console.log(`Row ${i} CIN:`, row[4], " | Nom:", row[6]);
    }

} catch (err) {
    console.error(`Error inspecting file: ${err.message}`);
}
