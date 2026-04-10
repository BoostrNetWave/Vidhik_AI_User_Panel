export interface ESOPPlanFormData {
    company_name: string;
    company_cin: string;
    registered_office: string;
    effective_date: string;
    total_option_pool: string | number;
    percentage_of_capital: string | number;
    eligibility_criteria: string;
    vesting_schedule: string;
    exercise_price_mechanism: string;
    exercise_period: string;
    lock_in_period?: string;
    accelerated_vesting: boolean;
    governing_law: string;
    listed_company: boolean;
    advisors_included: boolean;
    foreign_employees: boolean;
    additional_conditions?: string;
}

/**
 * Generate user prompt for ESOP Plan
 */
export const generateESOPPlanPrompt = (formData: ESOPPlanFormData): string => {
    return JSON.stringify(formData, null, 2);
};
