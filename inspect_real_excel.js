const XLSX = require('xlsx');

const filePath = 'BD_BENEFICIAIRES__final.xlsx';
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

// Find headers
const headerRowIndex = 3; // 4th row (0-indexed)
const headers = jsonData[headerRowIndex];

console.log("Headers:");
headers.forEach((h, i) => {
    if (h) console.log(`${i}: ${h}`);
});

console.log("\nSample rows (focusing on hierarchical columns):");
// Print rows 5 to 50
for (let i = headerRowIndex + 1; i < headerRowIndex + 50; i++) {
    const row = jsonData[i];
    if (row) {
        console.log(`Row ${i+1}:`);
        console.log(`  14 (Composante): ${row[14]}`);
        console.log(`  15 (Sous-comp): ${row[15]}`);
        console.log(`  16 (Activite): ${row[16]}`);
        console.log(`  17: ${row[17]}, 18: ${row[18]}`);
    }
}
