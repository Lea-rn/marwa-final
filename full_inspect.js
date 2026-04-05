const XLSX = require('xlsx');

const filePath = 'BD_BENEFICIAIRES__final.xlsx';

const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

console.log(`Total rows: ${jsonData.length}`);

// Print first 10 rows fully
for (let i = 0; i < 10; i++) {
    console.log(`\n=== Row ${i} ===`);
    const row = jsonData[i];
    row.forEach((cell, idx) => {
        if (cell !== '') console.log(`  col[${idx}]: ${JSON.stringify(cell)}`);
    });
}

// Find which rows contain composante-like text
console.log('\n=== Rows with "composante" or activity codes ===');
for (let i = 0; i < Math.min(200, jsonData.length); i++) {
    const row = jsonData[i];
    for (let j = 0; j < row.length; j++) {
        const cell = row[j] ? row[j].toString() : '';
        if (/^\d+\.?\d*\.?\d*[-–]/.test(cell) || cell.toLowerCase().includes('composante') || cell.toLowerCase().includes('activit')) {
            console.log(`Row ${i}, col ${j}: ${JSON.stringify(cell)}`);
        }
    }
}
