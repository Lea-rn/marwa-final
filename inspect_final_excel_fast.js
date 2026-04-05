const XLSX = require('xlsx');

const filePath = 'BD_BENEFICIAIRES__final.xlsx';

try {
    console.log(`--- Fast Inspecting ${filePath} ---`);
    const workbook = XLSX.readFile(filePath, { sheetRows: 50 }); // Only read 50 rows
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

    console.log(`Read ${jsonData.length} rows.`);

    const headersRow = jsonData[4];
    console.log('Headers (Row 4):', headersRow);
    
    for (let i = 5; i < Math.min(jsonData.length, 50); i++) {
        const row = jsonData[i];
        if (row[7] || row[8] || row[9]) {
            console.log(`Row ${i} Hierarchical Info:`, {
                composante: row[7],
                sous_composante: row[8],
                activite: row[9]
            });
        }
    }

} catch (err) {
    console.error(`Error inspecting file: ${err.message}`);
}
