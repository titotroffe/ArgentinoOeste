// Inspect last rows of 1963 and 2025 Clausura
const https = require('https');
const fs = require('fs');
const SPREADSHEET_ID = '1UathZ49ho5wC4H9w0eau-Ng8nP3b-YoDfbcSJLTSUTY';

const SHEETS = [
    { name: '1963', gid: '1673919991' },
    { name: '2025 Clausura', gid: '2104956215' }
];

function downloadCSV(gid) {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`;
    return new Promise((resolve, reject) => {
        const makeRequest = (requestUrl, redirectCount = 0) => {
            if (redirectCount > 5) return reject(new Error('Too many redirects'));
            const urlObj = new URL(requestUrl);
            https.get({ hostname: urlObj.hostname, path: urlObj.pathname + urlObj.search, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) return makeRequest(res.headers.location, redirectCount + 1);
                if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
                let data = ''; res.on('data', chunk => data += chunk); res.on('end', () => resolve(data)); res.on('error', reject);
            }).on('error', reject);
        };
        makeRequest(url);
    });
}

function parseCSV(text) {
    const rows = []; let currentRow = []; let currentField = ''; let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i]; const next = text[i + 1];
        if (inQuotes) { if (ch === '"' && next === '"') { currentField += '"'; i++; } else if (ch === '"') { inQuotes = false; } else { currentField += ch; } }
        else { if (ch === '"') { inQuotes = true; } else if (ch === ',') { currentRow.push(currentField.trim()); currentField = ''; } else if (ch === '\r' && next === '\n') { currentRow.push(currentField.trim()); rows.push(currentRow); currentRow = []; currentField = ''; i++; } else if (ch === '\n') { currentRow.push(currentField.trim()); rows.push(currentRow); currentRow = []; currentField = ''; } else { currentField += ch; } }
    }
    if (currentField || currentRow.length > 0) { currentRow.push(currentField.trim()); rows.push(currentRow); }
    return rows;
}

async function main() {
    let out = '';

    for (const sheet of SHEETS) {
        out += `\n=== ${sheet.name} (GID ${sheet.gid}) ===\n`;
        const csv = await downloadCSV(sheet.gid);
        const rows = parseCSV(csv);
        out += `Total rows: ${rows.length}\n`;

        // Find all regex matches to count them
        let count = 0;
        const datePattern = /\d+\s+de\s+\w+\s+(de\s+)?\d{4}/i;
        for (let i = 0; i < rows.length; i++) {
            for (let c = 0; c < (rows[i] || []).length; c++) {
                if (datePattern.test(rows[i][c] || '')) {
                    count++;
                }
            }
        }
        out += `Regex matches found: ${count}\n\n`;

        // Show last 30 rows
        const startRow = Math.max(0, rows.length - 30);
        out += `ROWS ${startRow} to ${rows.length - 1}:\n`;
        for (let i = startRow; i < rows.length; i++) {
            const row = rows[i] || [];
            // Only show populated cells or first 5 cols
            const cells = [];
            for (let c = 0; c < Math.min(15, row.length); c++) {
                if (row[c]) cells.push(`[${c}]="${row[c]}"`);
            }
            if (cells.length > 0) {
                out += `Row ${i}: ${cells.join(' | ')}\n`;
            } else {
                out += `Row ${i}: (empty)\n`;
            }
        }
    }

    fs.writeFileSync('diag-ends.txt', out);
    console.log('Written to diag-ends.txt');
}

main().catch(console.error);
