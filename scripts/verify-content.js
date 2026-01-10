
const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// MANUAL ENV PARSING
const envPath = path.resolve(process.cwd(), '.env.local');
const config = { projectId: '', dataset: '', token: '' };

try {
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        content.split(/\r?\n/).forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                let val = match[2].trim().replace(/^["'](.*)["']$/, '$1');
                if (key === 'NEXT_PUBLIC_SANITY_PROJECT_ID') config.projectId = val;
                if (key === 'NEXT_PUBLIC_SANITY_DATASET') config.dataset = val;
                if (key === 'SANITY_API_TOKEN') config.token = val;
            }
        });
    }
} catch (e) { }

const client = createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: '2024-01-01',
    token: config.token,
    useCdn: false,
});

async function verifyContent() {
    const query = '*[_id == "gloria-eterna-98-migrated"][0]';
    const result = await client.fetch(query);

    if (result) {
        console.log(`✅ Verification Successful!`);
        console.log(`Title: ${result.titulo}`);
        console.log(`Slug: ${result.slug.current}`);
    } else {
        console.error('❌ Document not found');
        process.exit(1);
    }
}

verifyContent();
