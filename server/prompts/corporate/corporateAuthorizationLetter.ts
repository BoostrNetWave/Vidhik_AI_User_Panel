export const generateCorporateAuthorizationLetterPrompt = (formData: any): string => {
    const data = {
        company_name: formData.companyName,
        company_cin: formData.companyCin,
        registered_office: formData.registeredOffice,
        authorized_person_name: formData.authorizedPersonName,
        authorized_person_designation: formData.authorizedPersonDesignation,
        id_details: formData.idDetails,
        purpose_of_authorization: formData.purposeOfAuthorization,
        scope_details: formData.scopeDetails,
        monetary_limit: formData.monetaryLimit,
        validity_start_date: formData.validityStartDate,
        validity_end_date: formData.validityEndDate,
        board_resolution_date: formData.boardResolutionDate,
        authority_recipient: formData.authorityRecipient,
        revocable: formData.revocable || false,
        additional_conditions: formData.additionalConditions
    };

    return JSON.stringify(data, null, 2);
};
