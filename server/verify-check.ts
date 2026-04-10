
import dotenv from 'dotenv';
import path from 'path';

// Load .env
const envPath = path.resolve(process.cwd(), '.env');
console.log('Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
    console.error('Error loading .env:', result.error);
}

console.log('OPENAI_API_KEY present:', !!process.env.OPENAI_API_KEY);
// console.log('OPENAI_API_KEY value:', process.env.OPENAI_API_KEY); // Be careful not to expose full key

console.log('OPENAI_API_KEY present:', !!process.env.OPENAI_API_KEY);

async function verifyMigration() {
    // Dynamic import to ensure env is loaded first
    const { llmService } = await import('./services/llmService');

    console.log('Verifying LLM Service Migration...');

    const request = {
        model: 'gpt-3.5-turbo', // Use a cheap model for verification
        systemPrompt: 'You are a test assistant.',
        userPrompt: 'This is a test message. Reply with "Verification Successful".',
        temperature: 0.7,
        maxTokens: 50
    };

    try {
        console.log('Sending request...');
        const response = await llmService.generate(request);
        console.log('\nResponse received:');
        console.log('Provider:', response.provider);
        console.log('Model:', response.model);
        console.log('Content:', response.content);

        if (response.provider === 'openai' || response.provider === 'openrouter') {
            console.log('\nSUCCESS: Service is using ' + response.provider);
        } else {
            console.log('\nWARNING: Unexpected provider: ' + response.provider);
        }

    } catch (error: any) {
        console.error('\nERROR: Generation failed:', error.message);
    }
}

verifyMigration();
