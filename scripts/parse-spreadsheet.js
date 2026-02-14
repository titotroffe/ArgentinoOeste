/**
 * Script para descargar y parsear la planilla de Google Sheets
 * "Estadisticas Argentino Oeste" y generar partidos.json
 *
 * Uso: node scripts/parse-spreadsheet.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const SPREADSHEET_ID = '1UathZ49ho5wC4H9w0eau-Ng8nP3b-YoDfbcSJLTSUTY';

const SHEETS = [
    { name: 'AÑO 1958', gid: '0', anio: 1958, torneo: 'Liga Nicoleña 1958' },
    { name: 'AÑO 1959', gid: '1551959988', anio: 1959, torneo: 'Liga Nicoleña 1959' },
    { name: 'AÑO 1960', gid: '986045718', anio: 1960, torneo: 'Liga Nicoleña 1960' },
    { name: 'AÑO 1961', gid: '349364335', anio: 1961, torneo: 'Liga Nicoleña 1961' },
    { name: 'AÑO 1962', gid: '1553629266', anio: 1962, torneo: 'Liga Nicoleña 1962' },
    { name: 'AÑO 1963', gid: '1673919991', anio: 1963, torneo: 'Liga Nicoleña 1963' },
    { name: 'AÑO 1964', gid: '1773442763', anio: 1964, torneo: 'Liga Nicoleña 1964' },
    { name: 'AÑO 1965', gid: '1498269300', anio: 1965, torneo: 'Liga Nicoleña 1965' },
    { name: 'AÑO 1966', gid: '1097267366', anio: 1966, torneo: 'Liga Nicoleña 1966' },
    { name: 'AÑO 1967', gid: '1941014375', anio: 1967, torneo: 'Liga Nicoleña 1967' },
    { name: 'AÑO 1968', gid: '235903906', anio: 1968, torneo: 'Liga Nicoleña 1968' },
    { name: 'AÑO 1969', gid: '147777829', anio: 1969, torneo: 'Liga Nicoleña 1969' },
    { name: 'AÑO 1970', gid: '1715099728', anio: 1970, torneo: 'Liga Nicoleña 1970' },
    { name: 'AÑO 1971', gid: '1071648699', anio: 1971, torneo: 'Liga Nicoleña 1971' },
    { name: 'AÑO 1972', gid: '1772143857', anio: 1972, torneo: 'Liga Nicoleña 1972' },
    { name: 'AÑO 1973', gid: '61785946', anio: 1973, torneo: 'Liga Nicoleña 1973' },
    { name: 'AÑO 2024 Apertura', gid: '1844745386', anio: 2024, torneo: 'Apertura 2024' },
    { name: 'AÑO 2024 Clausura', gid: '1034367570', anio: 2024, torneo: 'Clausura 2024' },
    { name: 'AÑO 2025 Copa Federacion', gid: '378637745', anio: 2025, torneo: 'Copa Federación 2025' },
    { name: 'AÑO 2025 Apertura', gid: '2126240701', anio: 2025, torneo: 'Apertura 2025' },
    { name: 'AÑO 2025 Clausura', gid: '2104956215', anio: 2025, torneo: 'Clausura 2025' },
    { name: 'AÑO 2025 Copa Nicoleña', gid: '703254057', anio: 2025, torneo: 'Copa Nicoleña 2025' },
];

function downloadCSV(gid) {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`;
    return new Promise((resolve, reject) => {
        const makeRequest = (requestUrl, redirectCount = 0) => {
            if (redirectCount > 5) return reject(new Error('Too many redirects'));

            const urlObj = new URL(requestUrl);
            const options = {
                hostname: urlObj.hostname,
                path: urlObj.pathname + urlObj.search,
                method: 'GET',
                headers: { 'User-Agent': 'Mozilla/5.0' }
            };

            https.get(options, (res) => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    return makeRequest(res.headers.location, redirectCount + 1);
                }
                if (res.statusCode !== 200) {
                    return reject(new Error(`HTTP ${res.statusCode}`));
                }
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(data));
                res.on('error', reject);
            }).on('error', reject);
        };
        makeRequest(url);
    });
}

/**
 * Parse CSV text into array of rows (array of cells).
 * Handles quoted fields with commas and newlines inside.
 */
function parseCSV(text) {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        const next = text[i + 1];

        if (inQuotes) {
            if (ch === '"' && next === '"') {
                currentField += '"';
                i++;
            } else if (ch === '"') {
                inQuotes = false;
            } else {
                currentField += ch;
            }
        } else {
            if (ch === '"') {
                inQuotes = true;
            } else if (ch === ',') {
                currentRow.push(currentField.trim());
                currentField = '';
            } else if (ch === '\r' && next === '\n') {
                currentRow.push(currentField.trim());
                rows.push(currentRow);
                currentRow = [];
                currentField = '';
                i++;
            } else if (ch === '\n') {
                currentRow.push(currentField.trim());
                rows.push(currentRow);
                currentRow = [];
                currentField = '';
            } else {
                currentField += ch;
            }
        }
    }
    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
    }
    return rows;
}

/**
 * Count ⚽ emojis in a string
 */
function countGoals(text) {
    if (!text) return 0;
    return (text.match(/⚽/g) || []).length;
}

/**
 * Clean player name - remove goal markers and extra whitespace
 */
function cleanName(text) {
    if (!text) return '';
    return text.replace(/⚽/g, '')
        .replace(/\(e\/c\)/gi, '')
        .replace(/e\/c/gi, '')
        .replace(/en contra/gi, '')
        .replace(/Pen\s*\(\d+\)/gi, '')
        .trim();
}

/**
 * Detect if a row cell contains a date header pattern like "20 de Abril de 1958" or "10 de Julio 1960"
 * Also handles special cases like "No se Jugo - Fecha 14"
 */
function isDateHeader(cell) {
    if (!cell) return false;
    // Standard date pattern
    if (/\d+\s+de\s+\w+\s+(de\s+)?\d{4}/i.test(cell)) return true;
    // Special cases starting with "No se Jugo" or "Suspendido" followed by hyphen/Fecha
    if (/^(no se jugo|suspendido)/i.test(cell) && /fecha|torneo/i.test(cell)) return true;
    return false;
}

/**
 * Extract match info from a date header string
 */
function parseDateHeader(header) {
    if (!header) return { fecha: '', instancia: '' };

    const dateMatch = header.match(/(\d+\s+de\s+\w+\s+(?:de\s+)?\d{4})/i);
    const fecha = dateMatch ? dateMatch[1] : (header.split('-')[0].trim());

    // Extract instancia: everything after the date and dash
    let instancia = '';
    const dashIdx = header.indexOf(' - ');
    if (dashIdx !== -1) {
        instancia = header.substring(dashIdx + 3).trim();
    } else if (!dateMatch) {
        // If no date found (e.g. "No se Jugo"), treat the rest as instancia if contains "Fecha"
        if (header.includes('Fecha')) {
            instancia = header;
        }
    }

    return { fecha, instancia };
}

/**
 * Determine match condition relative to Argentino Oeste
 */
function getCondicion(localTeam, visitanteTeam, headerRow) {
    const headerText = headerRow ? headerRow.join(' ').toLowerCase() : '';
    if (headerText.includes('neutral')) return 'Neutral';
    if (localTeam && localTeam.toLowerCase().includes('argentino')) return 'Local';
    return 'Visitante';
}

/**
 * Get the rival team name (whichever is not Argentino Oeste)
 */
function getRival(localTeam, visitanteTeam) {
    if (localTeam && localTeam.toLowerCase().includes('argentino')) return visitanteTeam;
    return localTeam;
}

/**
 * Detect match blocks in the CSV rows for a given column offset.
 * Each match block spans columns [offset..offset+4] (or [offset..offset+3] for Neutral)
 * Structure:
 *   Row 0: Date header
 *   Row 1: "Local", "Resultado", "", "Visitante" (or "Neutral")
 *   Row 2: Team names with score
 *   Row 3: "Titulares" header (optional, some sheets skip this)
 *   Row 4..N: Player names (local col offset+0, visitor col offset+3 or offset+4)
 *   Then "Cambios" row
 *   Then substitute players
 *   Then "Arbitro" row
 *   Then "Cancha" row
 *   Then "Director Tecnico" row
 *   Then DT name row
 */
function parseMatchesFromSheet(rows, sheetInfo) {
    const matches = [];
    let matchCounter = 0;

    // Scan for date header rows
    for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
        const row = rows[rowIdx];

        // Check each cell for a date header
        for (let colIdx = 0; colIdx < row.length; colIdx++) {
            if (!isDateHeader(row[colIdx])) continue;

            // Found a date header at (rowIdx, colIdx)
            // Determine the column block width by checking the next row for "Resultado"
            const headerRow = rows[rowIdx + 1];
            if (!headerRow) continue;

            // Find "Resultado" in this block - it tells us the center column
            let resultCol = -1;
            for (let c = colIdx; c < Math.min(colIdx + 6, (headerRow || []).length); c++) {
                if (headerRow[c] && headerRow[c].toLowerCase() === 'resultado') {
                    resultCol = c;
                    break;
                }
            }
            if (resultCol === -1) continue;

            // Column positions for this match block
            const localCol = colIdx;          // Local team name & players
            const scoreLocalCol = resultCol;   // Local score
            const scoreVisitorCol = resultCol + 1; // Visitor score

            // Find visitor column - it's after the score columns
            let visitorCol = resultCol + 2;
            // Check if the visitor column header says "Visitante" or "Neutral"
            for (let c = resultCol + 1; c < Math.min(resultCol + 4, (headerRow || []).length); c++) {
                const val = (headerRow[c] || '').toLowerCase();
                if (val === 'visitante' || val === 'neutral') {
                    visitorCol = c;
                    break;
                }
            }

            // Row with team names and scores (row after header row)
            const teamsRow = rows[rowIdx + 2];
            if (!teamsRow) continue;

            const localTeam = teamsRow[localCol] || '';
            const visitanteTeam = teamsRow[visitorCol] || '';

            // Parse scores - handle formats like "3 (1)" for penalties
            let scoreLocalRaw = teamsRow[scoreLocalCol] || '0';
            let scoreVisitorRaw = teamsRow[scoreVisitorCol] || '0';
            let scoreLocal = parseInt(scoreLocalRaw) || 0;
            let scoreVisitor = parseInt(scoreVisitorRaw) || 0;

            // Check for empty matches or "Libre"
            const dateHeaderText = row[colIdx] || '';
            if (dateHeaderText.toLowerCase().includes('libre') ||
                (!localTeam && !visitanteTeam)) {
                continue;
            }

            const { fecha, instancia } = parseDateHeader(dateHeaderText);
            const condicion = getCondicion(localTeam, visitanteTeam, headerRow);
            const rival = getRival(localTeam, visitanteTeam);

            // Calculate goles from Argentino's perspective
            let isArgLocal = condicion === 'Local';
            if (condicion === 'Neutral') {
                isArgLocal = (localTeam || '').toLowerCase().includes('argentino');
            }
            // Fallback: if not local and not neutral, assume visitor (or if neutral and not listed as local)

            const golesFavor = isArgLocal ? scoreLocal : scoreVisitor;
            const golesContra = isArgLocal ? scoreVisitor : scoreLocal;

            // Parse players - scan rows after teams row until we hit the DT name row or a block boundary
            const titularesLocal = [];
            const titularesVisitante = [];
            const suplentesLocal = [];
            const suplentesVisitante = [];
            const goleadoresLocal = [];
            const goleadoresVisitante = [];
            let arbitro = '';
            let cancha = '';
            let dt = '';
            let inCambios = false;
            let foundDT = false;

            // Determine the max rows to scan (up to 30 rows from team names row)
            const maxScanRow = Math.min(rowIdx + 30, rows.length);

            for (let pRow = rowIdx + 3; pRow < maxScanRow; pRow++) {
                const playerRow = rows[pRow];
                if (!playerRow) break;

                const cellLocal = (playerRow[localCol] || '').trim();
                const cellLocalScore = (playerRow[scoreLocalCol] || '').trim();
                const cellVisitorScore = (playerRow[scoreVisitorCol] || '').trim();
                const cellVisitor = (playerRow[visitorCol] || '').trim();

                // Stop if we hit the next date header in our column
                if (isDateHeader(cellLocal)) {
                    break;
                }

                // Check for section markers
                if (cellLocal.toLowerCase() === 'arbitro') {
                    // Arbitro value: scan columns after localCol for first non-empty value
                    arbitro = '';
                    for (let ac = localCol + 1; ac < Math.min(localCol + 5, (playerRow || []).length); ac++) {
                        if (playerRow[ac] && playerRow[ac].trim()) {
                            arbitro = playerRow[ac].trim();
                            break;
                        }
                    }
                    continue;
                }

                if (cellLocal.toLowerCase() === 'cancha') {
                    cancha = '';
                    for (let cc = localCol + 1; cc < Math.min(localCol + 5, (playerRow || []).length); cc++) {
                        if (playerRow[cc] && playerRow[cc].trim()) {
                            cancha = playerRow[cc].trim();
                            break;
                        }
                    }
                    continue;
                }

                if (cellLocal.toLowerCase() === 'director tecnico' || cellLocal.toLowerCase() === 'goles') {
                    continue; // Skip header, DT name is next row
                }

                if (cellLocal.toLowerCase() === 'titulares') {
                    continue; // Skip "Titulares" header
                }

                if (cellLocal.toLowerCase() === 'cambios') {
                    inCambios = true;
                    continue;
                }

                // Check if we've reached the DT name (after Director Tecnico)
                const prevRow = rows[pRow - 1];
                if (prevRow && (prevRow[localCol] || '').trim().toLowerCase() === 'director tecnico') {
                    dt = cellLocal;
                    foundDT = true;
                    break; // Done with this match block
                }

                // Skip empty rows (don't break - Arbitro/Cancha/DT may come after gaps)
                if (!cellLocal && !cellVisitor && !cellLocalScore && !cellVisitorScore) {
                    continue;
                }

                // Parse player names and goals
                if (cellLocal && cellLocal.toLowerCase() !== 'local' && cellLocal.toLowerCase() !== 'visitante' && cellLocal.toLowerCase() !== 'neutral') {
                    const playerName = cleanName(cellLocal);
                    const goalsInLocalScore = countGoals(cellLocalScore);
                    const goalsInName = countGoals(cellLocal);
                    const totalGoals = goalsInLocalScore + goalsInName;

                    if (playerName) {
                        if (inCambios) {
                            suplentesLocal.push(playerName);
                        } else {
                            titularesLocal.push(playerName);
                        }
                        if (totalGoals > 0) {
                            const isOwnGoal = /e\/c|en contra/i.test(cellLocal) || /e\/c|en contra/i.test(cellLocalScore);
                            if (isOwnGoal) {
                                goleadoresVisitante.push({ jugador: playerName + ' (e/c)', goles: totalGoals });
                            } else {
                                goleadoresLocal.push({ jugador: playerName, goles: totalGoals });
                            }
                        }
                    }
                }

                if (cellVisitor && cellVisitor.toLowerCase() !== 'visitante' && cellVisitor.toLowerCase() !== 'neutral' && cellVisitor.toLowerCase() !== 'titulares' && cellVisitor.toLowerCase() !== 'cambios') {
                    const playerName = cleanName(cellVisitor);
                    const goalsInVisitorScore = countGoals(cellVisitorScore);
                    const goalsInName = countGoals(cellVisitor);
                    const totalGoals = goalsInVisitorScore + goalsInName;

                    if (playerName) {
                        if (inCambios) {
                            suplentesVisitante.push(playerName);
                        } else {
                            titularesVisitante.push(playerName);
                        }
                        if (totalGoals > 0) {
                            const isOwnGoal = /e\/c|en contra/i.test(cellVisitor) || /e\/c|en contra/i.test(cellVisitorScore);
                            if (isOwnGoal) {
                                goleadoresLocal.push({ jugador: playerName + ' (e/c)', goles: totalGoals });
                            } else {
                                goleadoresVisitante.push({ jugador: playerName, goles: totalGoals });
                            }
                        }
                    }
                }
            }

            matchCounter++;
            const matchId = `${sheetInfo.anio}-${String(matchCounter).padStart(2, '0')}`;

            matches.push({
                id: matchId,
                fecha,
                anio: sheetInfo.anio,
                torneo: sheetInfo.torneo,
                instancia: instancia || '',
                condicion,
                rival: rival || 'Desconocido',
                equipoLocal: localTeam || '',
                equipoVisitante: visitanteTeam || '',
                golesLocal: scoreLocal,
                golesVisitante: scoreVisitor,
                golesFavor,
                golesContra,
                resultado: `${golesFavor} - ${golesContra}`,
                cancha: cancha || '',
                arbitro: arbitro || '',
                dt: dt || '',
                titularesLocal,
                titularesVisitante,
                suplentesLocal,
                suplentesVisitante,
                goleadoresLocal,
                goleadoresVisitante,
            });
        }
    }

    return matches;
}

async function main() {
    console.log('🏟️  Parseando planilla "Estadisticas Argentino Oeste"...\n');

    const allMatches = [];
    let totalSheets = SHEETS.length;
    let processed = 0;

    for (const sheet of SHEETS) {
        processed++;
        process.stdout.write(`[${processed}/${totalSheets}] Descargando ${sheet.name}...`);

        try {
            const csv = await downloadCSV(sheet.gid);
            const rows = parseCSV(csv);
            const matches = parseMatchesFromSheet(rows, sheet);

            console.log(` ✅ ${matches.length} partidos encontrados`);
            allMatches.push(...matches);
        } catch (err) {
            console.log(` ❌ Error: ${err.message}`);
        }

        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 500));
    }

    // Reassign sequential IDs
    allMatches.forEach((match, idx) => {
        match.id = `match-${String(idx + 1).padStart(4, '0')}`;
    });

    // Write output
    const outputPath = path.resolve(__dirname, '..', 'src', 'data', 'partidos.json');
    fs.writeFileSync(outputPath, JSON.stringify(allMatches, null, 2), 'utf8');

    console.log(`\n✅ Total: ${allMatches.length} partidos guardados en src/data/partidos.json`);

    // Print summary per year
    const byYear = {};
    allMatches.forEach(m => {
        byYear[m.anio] = (byYear[m.anio] || 0) + 1;
    });
    console.log('\n📊 Resumen por año:');
    Object.keys(byYear).sort().forEach(year => {
        console.log(`   ${year}: ${byYear[year]} partidos`);
    });
}

main().catch(err => {
    console.error('💥 Error fatal:', err);
    process.exit(1);
});
