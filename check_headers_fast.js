const XLSX = require('xlsx');
const fs = require('fs');

const filePath = 'BD_BENEFICIAIRES__final.xlsx';
if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
}

try {
    const workbook = XLSX.readFile(filePath, { sheetRows: 100 });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

    const headerIndex = 4;
    const headers = jsonData[headerIndex];
    console.log('--- Headers at index 4 ---');
    if (headers) {
        headers.forEach((h, i) => console.log(`${i}: ${h}`));
    } else {
        console.log('No headers found at index 4');
    }

} catch (e) {
    console.error('Error:', e);
}
