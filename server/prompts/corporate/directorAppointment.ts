export const generateDirectorAppointmentPrompt = (formData: any): string => {
    const data = {
        company_name: formData.companyName,
        company_cin: formData.companyCin,
        registered_office: formData.registeredOffice,
        director_name: formData.directorName,
        director_address: formData.directorAddress,
        din: formData.din,
        appointment_type: formData.appointmentType,
        designation: formData.designation,
        effective_date: formData.effectiveDate,
        term_duration: formData.termDuration,
        remuneration_details: formData.remunerationDetails,
        board_resolution_date: formData.boardResolutionDate,
        shareholder_approval_required: formData.shareholderApprovalRequired,
        additional_terms: formData.additionalTerms
    };

    return JSON.stringify(data, null, 2);
};
