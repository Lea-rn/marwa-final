const XLSX = require('xlsx');
const fs = require('fs');

const filePath = 'BD_BENEFICIAIRES__final.xlsx';
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

const headerRowIndex = 3; // 4th row (0-indexed)
let out = "Sample rows:\n";
// Print rows 5 to 50
for (let i = headerRowIndex + 1; i < headerRowIndex + 50; i++) {
    const row = jsonData[i];
    if (row) {
        out += `Row ${i+1}: C=[${row[14] ? row[14].substring(0,15) : ''}] SC=[${row[15] ? row[15].substring(0,15) : ''}] A=[${row[16] ? row[16].substring(0,25) : ''}]\n`;
    }
}
fs.writeFileSync('excel_dump.txt', out, 'utf8');
console.log('Done');
