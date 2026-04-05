const XLSX = require('xlsx');

const filePath = 'BD_BENEFICIAIRES__final.xlsx';

try {
    const workbook = XLSX.readFile(filePath, { sheetRows: 50 });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

    console.log(`--- Searching for 8-digit strings in ${filePath} ---`);
    
    for (let i = 5; i < jsonData.length; i++) {
        const row = jsonData[i];
        const candidates = row.map((v, colIdx) => ({ v, colIdx }))
                            .filter(obj => obj.v && /^\d{8}$/.test(obj.v.toString().trim()));
        
        if (candidates.length > 0) {
            console.log(`Row ${i} candidates:`, candidates);
        }
    }

} catch (err) {
    console.error(`Error: ${err.message}`);
}
