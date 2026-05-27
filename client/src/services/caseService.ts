import api from '../lib/api';

export interface IMilestone {
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    progressIncrement: number;
    payoutAmount: number;
    payoutStatus: 'pending' | 'requested' | 'approved' | 'rejected';
    proofDocs: {
        name: string;
        url: string;
        uploadedAt: string;
        details?: string;
    }[];
    completedAt?: string;
}

export interface ICase {
    _id: string;
    title: string;
    description: string;
    client: string;
    lawyer: {
        _id: string;
        fullName: string;
        email: string;
        phone?: string;
        location?: string;
        title?: string;
        expertise?: string;
        avatar?: string;
    };
    status: 'active' | 'completed' | 'cancelled';
    totalFee: number;
    currentProgress: number;
    planSubmitted: boolean;
    planApproved: boolean;
    milestones: IMilestone[];
    createdAt: string;
    updatedAt: string;
}

export const caseService = {
    async getClientCases(): Promise<ICase[]> {
        const response = await api.get('/cases/client');
        return response.data;
    },

    async getCaseById(id: string): Promise<ICase> {
        const response = await api.get(`/cases/${id}`);
        return response.data;
    },

    async approvePlan(id: string): Promise<ICase> {
        const response = await api.put(`/cases/${id}/approve-plan`);
        return response.data;
    },

    async hireLawyer(data: { lawyerId: string; title: string; description: string; totalFee: number }): Promise<ICase> {
        const response = await api.post('/cases/hire', data);
        return response.data;
    }
};
