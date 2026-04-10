export interface ConvertibleNoteFormData {
    company_name: string;
    company_cin: string;
    registered_office: string;
    investor_name: string;
    investor_address: string;
    principal_amount: string | number;
    interest_rate?: string | number;
    issue_date: string;
    maturity_date: string;
    valuation_cap?: string | number;
    discount_rate?: string | number;
    qualified_financing_threshold?: string | number;
    conversion_type: 'automatic' | 'optional' | string;
    repayment_on_maturity: boolean;
    governing_law: string;
    arbitration_clause?: string;
    foreign_investor: boolean;
    additional_rights?: string;
}

/**
 * Generate user prompt for Convertible Note Agreement
 */
export const generateConvertibleNotePrompt = (formData: ConvertibleNoteFormData): string => {
    return JSON.stringify(formData, null, 2);
};
