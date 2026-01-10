
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log("--- START ENV CHECK ---");
if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.log("PROJECT_ID_STATUS: PRESENT");
} else {
    console.log("PROJECT_ID_STATUS: MISSING");
}

if (process.env.NEXT_PUBLIC_SANITY_DATASET) {
    console.log("DATASET_STATUS: PRESENT");
} else {
    console.log("DATASET_STATUS: MISSING");
}

if (process.env.SANITY_API_TOKEN) {
    console.log("TOKEN_STATUS: PRESENT");
} else {
    console.log("TOKEN_STATUS: MISSING");
}
console.log("--- END ENV CHECK ---");
