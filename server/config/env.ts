// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.join(process.cwd(), '.env');
console.log(`Loading .env from: ${envPath}`);
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.warn("Error loading .env file:", result.error);
} else {
    console.log(".env loaded successfully");
    console.log("PORT from .env:", result.parsed?.PORT);
    console.log("SARVAM_API_KEY:", process.env.SARVAM_API_KEY ? 'SET' : 'NOT SET');
    console.log("OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY ? 'SET' : 'NOT SET');
}
