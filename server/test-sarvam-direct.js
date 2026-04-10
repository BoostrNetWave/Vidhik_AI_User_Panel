import axios from 'axios';
import fs from 'fs';

const API_KEY = 'sk_014u7naw_LhdPskwT5KQcWKfr7xRR6EZb';
const URL = 'https://api.sarvam.ai/v1/chat/completions';

function log(msg) {
    console.log(msg);
    fs.appendFileSync('server/sarvam-test.log', msg + '\n');
}

async function testModel(modelName) {
    log(`\nTesting model: ${modelName}...`);
    try {
        const response = await axios.post(
            URL,
            {
                model: modelName,
                messages: [{ role: 'user', content: 'Hello' }],
                max_tokens: 10
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );
        log(`✅ SUCCESS: ${modelName}`);
        log('Response: ' + response.data.choices[0].message.content);
        return true;
    } catch (error) {
        log(`❌ FAILED: ${modelName}`);
        if (error.response) {
            log('Status: ' + error.response.status);
            log('Data: ' + JSON.stringify(error.response.data));
        } else {
            log('Error: ' + error.message);
        }
        return false;
    }
}

async function run() {
    try {
        fs.unlinkSync('server/sarvam-test.log');
    } catch (e) { }

    const models = ['saaras-2b', 'sarvam-2b', 'OpenHathi-7B-Hi-v0.1-Base', 'sarvam-m'];

    for (const model of models) {
        if (await testModel(model)) break;
    }
}

run();
