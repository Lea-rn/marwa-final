const XLSX = require('xlsx');
const fs = require('fs');

const filePath = 'BD_BENEFICIAIRES__final.xlsx';

try {
    const workbook = XLSX.readFile(filePath, { sheetRows: 20 });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

    console.log(`--- Headers and Sample for ${filePath} ---`);
    if (jsonData.length > 4) {
        const headers = jsonData[4]; // Row 5
        console.log("Headers (Row 5):");
        headers.forEach((h, i) => {
            console.log(`  [${i}]: ${h}`);
        });

        console.log("\nSample Row (Row 6):");
        const sample = jsonData[5];
        if (sample) {
            sample.forEach((v, i) => {
                console.log(`  [${i}] (${headers[i]}): ${v}`);
            });
        }
    } else {
        console.log("Not enough rows found.");
        jsonData.forEach((row, i) => {
            console.log(`Row ${i}:`, row);
        });
    }
} catch (err) {
    console.error(`Error: ${err.message}`);
}
