// Inspect Copa Nicoleña 2025
const https = require('https');
const fs = require('fs');
const SPREADSHEET_ID = '1UathZ49ho5wC4H9w0eau-Ng8nP3b-YoDfbcSJLTSUTY';
const GID = '703254057';

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
    console.log(`Downloading Copa Nicoleña 2025...`);
    const csv = await downloadCSV(GID);
    const rows = parseCSV(csv);
    console.log(`Total rows: ${rows.length}`);

    // Dump all rows to see what's there
    let out = '';
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = [];
        for (let c = 0; c < row.length; c++) {
            if (row[c]) cells.push(`[${c}]="${row[c]}"`);
        }
        if (cells.length > 0) out += `Row ${i}: ${cells.join(' | ')}\n`;
    }

    fs.writeFileSync('diag-nicolena.txt', out);
    console.log('Written to diag-nicolena.txt');
}

main().catch(console.error);
