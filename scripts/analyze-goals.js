const fs = require('fs');
const partidos = require('../src/data/partidos.json');

console.log(`Analizando ${partidos.length} partidos...`);

let errors = 0;
let neutralErrors = 0;

partidos.forEach((p, index) => {
    // Determine Argentino's role
    const isLocal = (p.condicion === 'Local') ||
        (p.condicion === 'Neutral' && (p.equipoLocal || '').toLowerCase().includes('argentino'));

    // In some neutral matches, Argentino might be visitor?
    // My previous logic: if Neutral, check if localTeam includes 'argentino'.

    // Let's verify what the fields say
    let expectedGF, expectedGC;

    // Check if Argentino is explicitly in local or visitor column
    const argIsLocalTeam = (p.equipoLocal || '').toLowerCase().includes('argentino');
    const argIsVisitorTeam = (p.equipoVisitante || '').toLowerCase().includes('argentino');

    if (argIsLocalTeam) {
        expectedGF = p.golesLocal;
        expectedGC = p.golesVisitante;
    } else if (argIsVisitorTeam) {
        expectedGF = p.golesVisitante;
        expectedGC = p.golesLocal;
    } else {
        // Argentino not found in either team??
        console.log(`[WARN] Match ${p.id} (${p.anio}): Argentino Oeste no figura ni de local ni de visitante. (${p.equipoLocal} vs ${p.equipoVisitante})`);
        return;
    }

    if (p.golesFavor !== expectedGF || p.golesContra !== expectedGC) {
        console.log(`[ERROR] Match ${p.id} (${p.anio}) vs ${p.rival} (${p.condicion}):`);
        console.log(`   Display: ${p.equipoLocal} (${p.golesLocal}) - ${p.equipoVisitante} (${p.golesVisitante})`);
        console.log(`   Saved Stats: GF=${p.golesFavor}, GC=${p.golesContra}. Expected: GF=${expectedGF}, GC=${expectedGC}`);
        errors++;
        if (p.condicion === 'Neutral') neutralErrors++;
    }
});

console.log(`\nTotal Errors: ${errors}`);
console.log(`Neutral Errors: ${neutralErrors}`);
