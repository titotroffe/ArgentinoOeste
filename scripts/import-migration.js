
const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// MANUAL ENV PARSING - proven to work
const envPath = path.resolve(process.cwd(), '.env.local');
console.log(`Reading config from: ${envPath}`);

const config = {
    projectId: '',
    dataset: '',
    token: ''
};

try {
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const lines = content.split(/\r?\n/);

        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return;

            const eqIdx = trimmed.indexOf('=');
            if (eqIdx !== -1) {
                const key = trimmed.substring(0, eqIdx).trim();
                const val = trimmed.substring(eqIdx + 1).trim();

                // Remove quotes if present
                const cleanVal = val.replace(/^["'](.*)["']$/, '$1');

                if (key === 'NEXT_PUBLIC_SANITY_PROJECT_ID') config.projectId = cleanVal;
                if (key === 'NEXT_PUBLIC_SANITY_DATASET') config.dataset = cleanVal;
                if (key === 'SANITY_API_TOKEN') config.token = cleanVal;
            }
        });
    }
} catch (e) {
    console.error("Error reading .env.local:", e.message);
}

// Fallback to process.env if not found in file (e.g. CI)
if (!config.projectId) config.projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
if (!config.dataset) config.dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
if (!config.token) config.token = process.env.SANITY_API_TOKEN;

console.log('--- Configuration ---');
console.log(`Project ID: ${config.projectId ? config.projectId : 'MISSING'}`);
console.log(`Dataset: ${config.dataset ? config.dataset : 'MISSING'}`);
console.log(`Token: ${config.token ? 'PRESENT (' + config.token.length + ' chars)' : 'MISSING'}`);
console.log('---------------------');

if (!config.projectId || !config.dataset || !config.token) {
    console.error('❌ Missing required configuration. bailing out.');
    process.exit(1);
}

const client = createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: '2024-01-01',
    token: config.token,
    useCdn: false,
});

async function importMigration() {
    try {
        const migrationFilePath = path.resolve(process.cwd(), 'migration-doc.json');
        if (!fs.existsSync(migrationFilePath)) {
            throw new Error(`Migration file not found at ${migrationFilePath}`);
        }

        const docContent = fs.readFileSync(migrationFilePath, 'utf8');
        const doc = JSON.parse(docContent);

        console.log(`Importing document: ${doc._id} (${doc.titulo})...`);

        const result = await client.createOrReplace(doc);

        console.log('✅ Document imported successfully!');
        console.log(`Document ID: ${result._id}`);
    } catch (error) {
        console.error('❌ Import failed:', error.message);
        if (error.response) {
            console.error('API Response:', error.response.body);
        }
        process.exit(1);
    }
}

importMigration();
