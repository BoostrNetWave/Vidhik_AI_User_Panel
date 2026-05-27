import api from '../lib/api';

export const lawyerService = {
    async getPublicLawyers() {
        // This is a public route, so no auth token needed, 
        // but our api instance adds it if present.
        const response = await api.get('/admin/public/lawyers');
        return response.data;
    },

    async getPublicLawyerById(id: string) {
        const response = await api.get(`/admin/public/lawyers/${id}`);
        return response.data;
    }
};
