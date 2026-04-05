const XLSX = require('xlsx');

const filePath = 'BD_BENEFICIAIRES__final.xlsx';

try {
    const workbook = XLSX.readFile(filePath);
    console.log(`Sheet Names: ${workbook.SheetNames}`);
} catch (err) {
    console.error(`Error: ${err.message}`);
}
