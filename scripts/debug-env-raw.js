
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env.local');
console.log(`Reading raw file from: ${envPath}`);

try {
    const buffer = fs.readFileSync(envPath);
    console.log(`File size: ${buffer.length} bytes`);

    // Check for BOM
    if (buffer.length >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
        console.log("⚠️  UTF-8 BOM detected!");
    } else if (buffer.length >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
        console.log("⚠️  UTF-16 LE BOM detected!");
    } else {
        console.log("No BOM detected.");
    }

    const content = buffer.toString('utf8'); // Try simple UTF-8 first
    console.log("--- Raw Content Preview (First 200 chars) ---");
    console.log(content.substring(0, 200));
    console.log("--- End Preview ---");

    console.log("\nParsing lines...");
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return;
        if (trimmed.startsWith('#')) return;

        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
            const key = trimmed.substring(0, eqIdx).trim();
            const val = trimmed.substring(eqIdx + 1).trim();
            console.log(`Line ${index + 1}: Found key '${key}' with value length ${val.length}`);
        } else {
            console.log(`Line ${index + 1}: ⚠️  Line without '=': "${trimmed}"`);
        }
    });

} catch (err) {
    console.error("Error reading file:", err.message);
}
