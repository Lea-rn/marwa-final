const XLSX = require('xlsx');
const fs = require('fs');

const filePath = 'BD_BENEFICIAIRES__final.xlsx';

try {
    const workbook = XLSX.readFile(filePath, { sheetRows: 20 });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

    let output = '';
    data.forEach((row, r) => {
        output += `Row ${r}: ` + row.map((cell, c) => `[${c}]="${cell}"`).join(' | ') + '\n';
    });

    fs.writeFileSync('excel_structure.txt', output);
    console.log('Saved structure to excel_structure.txt');
} catch (err) {
    console.error(err);
}
