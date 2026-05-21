import api from '../lib/api';

export const adminService = {
    async getConfigs() {
        const response = await api.get('/admin/config');
        return response.data;
    },

    async updateConfig(key: string, value: any) {
        const response = await api.put('/admin/config', { key, value });
        return response.data;
    },

    async getAllUsers() {
        const response = await api.get('/admin/users');
        return response.data;
    },

    async getPendingLawyers() {
        const response = await api.get('/admin/pending-lawyers');
        return response.data;
    },

    async approveLawyer(id: string) {
        const response = await api.post(`/admin/approve-lawyer/${id}`);
        return response.data;
    },

    async verifyUser(id: string) {
        const response = await api.post(`/admin/verify-user/${id}`);
        return response.data;
    }
};
