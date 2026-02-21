const https = require('https');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const key = process.env.GEMINI_API_KEY;

if (!key) {
    console.error("No se encontró la GEMINI_API_KEY en .env.local");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error("Error de API:", json.error.message);
                return;
            }
            console.log("--- Modelos Disponibles ---");
            json.models.forEach(m => {
                // Only show models that support generateContent
                if (m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`- ${m.name.split('/').pop()} (${m.displayName})`);
                }
            });
            console.log("---------------------------");
        } catch (e) {
            console.error("Error parseando respuesta:", e.message);
        }
    });
}).on('error', (err) => {
    console.error("Error de conexión:", err.message);
});
