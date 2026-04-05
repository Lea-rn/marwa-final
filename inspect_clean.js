const XLSX = require('xlsx');

const filePath = 'BD_BENEFICIAIRES__final.xlsx';

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

    console.log('--- Row 0 ---', jsonData[0]);
    console.log('--- Row 1 ---', jsonData[1]);
    console.log('--- Row 2 ---', jsonData[2]);
    console.log('--- Row 3 ---', jsonData[3]);
    console.log('--- Row 4 ---', jsonData[4]);
    console.log('--- Row 5 ---', jsonData[5]);

    // Search for headers if row 4 is not it
    for (let i = 0; i < 20; i++) {
        if (jsonData[i] && jsonData[i].some(cell => cell.toString().includes('Composante'))) {
            console.log(`Potential Header Row Found at index ${i}:`, jsonData[i]);
        }
    }

} catch (err) {
    console.error(`Error: ${err.message}`);
}
