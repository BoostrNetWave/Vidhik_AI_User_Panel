import api from '../lib/api';

export interface DocumentGenerationRequest {
    documentType: string;
    formData: any;
    userId?: string;
    model?: string;
}

export interface DocumentGenerationResponse {
    success: boolean;
    document: string;
    message: string;
    modelUsed: string;
    provider: string;
    tokensUsed: number;
    audit?: any; // For future use
}

export const documentService = {
    /**
     * Generate a document using the AI backend
     */
    async generateDocument(request: DocumentGenerationRequest): Promise<DocumentGenerationResponse> {
        try {
            const response = await api.post('/documents/generate', request);
            return response.data;
        } catch (error: any) {
            console.error('Document generation failed. Full error details:', error);
            if (error.response) {
                console.error('Server response data:', error.response.data);
                console.error('Server response status:', error.response.status);
            }
            throw error.response?.data || error;
        }
    },

    /**
     * Get available document types
     */
    async getDocumentTypes() {
        try {
            const response = await api.get('/documents/types');
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch document types:', error);
            throw error.response?.data || error;
        }
    }
};
