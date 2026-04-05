const XLSX = require('xlsx');
const fs = require('fs');

const filePath = 'BD_BENEFICIAIRES__final.xlsx';
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

const headerRowIndex = 3;
const rawActivityCounts = {};

for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (row && row[16]) {
        const rawA = row[16].toString().trim();
        const rawC = row[14] ? row[14].toString().trim() : '';
        const rawSC = row[15] ? row[15].toString().trim() : '';
        
        // Focus only on component 1 and subcomponent 1.3
        if (rawC.startsWith('1.') && rawSC.startsWith('1.3')) {
            rawActivityCounts[rawA] = (rawActivityCounts[rawA] || 0) + 1;
        }
    }
}

let out = "Raw activities in Component 1, Subcomponent 1.3:\n";
for (const [a, count] of Object.entries(rawActivityCounts)) {
    out += `- ${count} rows: "${a}"\n`;
}

fs.writeFileSync('raw_activities_dump.txt', out, 'utf8');
console.log('Done writing to raw_activities_dump.txt');
