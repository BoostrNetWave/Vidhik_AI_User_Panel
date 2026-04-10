export interface PoACorporateFormData {
    company_name: string;
    company_cin: string;
    registered_office: string;
    authorized_signatory_name: string;
    authorized_signatory_designation: string;
    board_resolution_date: string;
    attorney_name: string;
    attorney_address: string;
    attorney_id_details?: string;
    purpose_of_poa: string;
    specific_powers: string[];
    monetary_limit?: string;
    geographic_limit?: string;
    delegation_allowed: boolean;
    effective_date: string;
    expiry_date?: string;
    revocable: boolean;
    registration_required: boolean;
    additional_clauses?: string;
}

/**
 * Generate user prompt for Corporate Power of Attorney
 */
export const generatePoACorporatePrompt = (formData: PoACorporateFormData): string => {
    return JSON.stringify(formData, null, 2);
};
