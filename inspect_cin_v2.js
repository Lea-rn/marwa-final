const XLSX = require('xlsx');
const fs = require('fs');

const filePath = 'BD_BENEFICIAIRES__final.xlsx';

if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
}

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    // Read only first 10 rows to be fast
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 0, defval: '' });

    console.log(`--- Inspecting ${filePath} ---`);
    
    // Row 4 (index 4) should be headers
    const headerRowIdx = 4;
    const headers = jsonData[headerRowIdx];
    
    if (!headers) {
        console.log("No headers found at row 5");
        // Print row 0 just in case
        console.log("Row 0 headers:", jsonData[0]);
    } else {
        console.log("Headers (Row 5):");
        headers.forEach((h, i) => {
            console.log(`  [${i}]: ${h}`);
        });

        console.log("\nSample Data (Row 6):");
        const sampleRow = jsonData[5];
        if (sampleRow) {
            sampleRow.forEach((v, i) => {
                console.log(`  [${i}] (${headers[i]}): ${v}`);
            });
        }
    }

} catch (err) {
    console.error(`Error: ${err.message}`);
}
