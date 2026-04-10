import dotenv from 'dotenv';
import path from 'path';

// Load .env
const envPath = path.resolve(process.cwd(), '../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

console.log('\n===  ENV VARIABLES CHECK ===');
// console.log('SARVAM_API_KEY:', process.env.SARVAM_API_KEY ? `${process.env.SARVAM_API_KEY.substring(0, 10)}...` : 'NOT SET');
console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? `${process.env.OPENROUTER_API_KEY.substring(0, 10)}...` : 'NOT SET');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? `${process.env.OPENAI_API_KEY.substring(0, 10)}...` : 'NOT SET');
console.log('\n');

// Test Sarvam API directly
import axios from 'axios';

async function testSarvamAPI() {
    console.log('Sarvam API test disabled.');
    /*
    try {
        console.log('Testing Sarvam API directly...');
        const response = await axios.post(
            'https://api.sarvam.ai/v1/chat/completions',
            {
                model: 'sarvam-m',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: 'Say hello in one sentence.' }
                ],
                max_tokens: 50
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.SARVAM_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('✓ Sarvam API works!');
        console.log('Response:', response.data.choices[0]?.message?.content);
    } catch (error) {
        console.error('✗ Sarvam API failed:', error.response?.data || error.message);
    }
    */
}

async function testOpenRouterAPI() {
    try {
        console.log('\nTesting OpenRouter API directly...');
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'meta-llama/llama-3.3-70b-instruct',
                messages: [
                    { role: 'user', content: 'Say hello in one sentence.' }
                ],
                max_tokens: 50
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('✓ OpenRouter API works!');
        console.log('Response:', response.data.choices[0]?.message?.content);
    } catch (error) {
        console.error('✗ OpenRouter API failed:', error.response?.data || error.message);
    }
}

// testSarvamAPI().then(() => testOpenRouterAPI());
testOpenRouterAPI();
