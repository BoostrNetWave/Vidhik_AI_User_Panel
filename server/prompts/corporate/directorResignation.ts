export const generateDirectorResignationPrompt = (formData: any): string => {
    const data = {
        director_name: formData.directorName,
        din: formData.din,
        designation: formData.designation,
        company_name: formData.companyName,
        registered_office: formData.registeredOffice,
        resignation_date: formData.resignationDate,
        effective_date: formData.effectiveDate,
        reason_for_resignation: formData.reason,
        transition_support_required: formData.transitionSupportRequired || false,
        additional_statements: formData.additionalStatements
    };

    return JSON.stringify(data, null, 2);
};
