
const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
const result = dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (result.error) {
    console.log("Error loading .env.local:", result.error);
}

console.log("Checking environment variables:");
console.log("NEXT_PUBLIC_SANITY_PROJECT_ID:", process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? "Present" : "Missing");
console.log("NEXT_PUBLIC_SANITY_DATASET:", process.env.NEXT_PUBLIC_SANITY_DATASET ? "Present" : "Missing");
console.log("SANITY_API_TOKEN:", process.env.SANITY_API_TOKEN ? "Present" : "Missing");
