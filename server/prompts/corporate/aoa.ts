// Articles of Association (AOA) Prompt Template
// Compliant with Companies Act, 2013 (India)

export const generateAOAPrompt = (formData: any): string => {
    const data = {
        company_name: formData.companyName,
        company_type: formData.companyType || 'Private Limited',
        authorized_share_capital: formData.authorizedCapital,
        number_of_directors: formData.numberOfDirectors,
        transfer_restrictions_required: formData.transferRestrictionsRequired ?? true,
        nominee_director_allowed: formData.nomineeDirectorAllowed ?? false,
        retirement_by_rotation_applicable: formData.retirementByRotationApplicable ?? (formData.companyType === 'Public Limited'),
        common_seal_required: formData.commonSealRequired ?? false,
        borrowing_limit: formData.borrowingLimit,
        additional_governance_clauses: formData.additionalGovernanceClauses
    };

    return JSON.stringify(data, null, 2);
};
