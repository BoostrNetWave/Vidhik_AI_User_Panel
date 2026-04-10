import axios from 'axios';

// Test document generation
async function testDocumentGeneration() {
    try {
        console.log('Testing document generation API...\n');

        // Test 1: Get document types
        console.log('1. Fetching document types...');
        const typesResponse = await axios.get('http://localhost:5003/api/documents/types');
        console.log('✓ Document types:', typesResponse.data.count, 'types available\n');

        // Test 2: Generate a simple employment contract
        console.log('2. Generating employment contract...');
        const generateResponse = await axios.post('http://localhost:5003/api/documents/generate', {
            documentType: 'employment-contract',
            formData: {
                employerName: 'Tech Solutions Pvt Ltd',
                employeeName: 'Rajesh Kumar',
                jobTitle: 'Software Engineer',
                startDate: '2024-03-01',
                salary: '₹12,00,000 per annum'
            }
        });

        console.log('✓ Document generated successfully!');
        console.log('Provider:', generateResponse.data.provider);
        console.log('Model:', generateResponse.data.modelUsed);
        console.log('Tokens:', generateResponse.data.tokensUsed);
        console.log('Content length:', generateResponse.data.document.length, 'characters\n');

        console.log('=== TEST PASSED ===');

    } catch (error) {
        console.error('✗ Test failed:', error.response?.data || error.message);
        process.exit(1);
    }
}

testDocumentGeneration();
